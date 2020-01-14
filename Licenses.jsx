import React from "react";
import * as licenseService from "../../services/licenseService";
import logger from "debug";
import LicenseCard from "./LicenseCard";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import swal from "sweetalert2";
import propTypes from "prop-types";
import { NavLink } from "react-router-dom";
import * as authService from "../../services/authService";
import * as locationServices from "../../services/locationServices";

const _logger = logger.extend("Licenses");

export default class Licenses extends React.Component {
  state = {
    activePage: 1,
    licenses: [],
    searched: [],
    searchString: "",
    totalItems: 0,
    stateName: 0,
    currentUser: 0,
    stateOptions: []
  };

  componentDidMount() {
    this.getAuth();
    this.getStates();
  }

  renderState = state => {
    return (
      <option key={state.id + "0"} value={state.id}>
        {state.name}
      </option>
    );
  };
  getStates = () => {
    locationServices
      .getAllStates()
      .then(this.getStatesSuccess)
      .catch(this.getStatesFail);
  };
  getStatesSuccess = resp => {
    _logger("Got your states", resp.data.items);

    this.setState(prevState => {
      return {
        ...prevState,
        stateOptions: resp.data.items.map(this.renderState)
      };
    });
  };
  getStatesFail = resp => {
    _logger("Failed to get states", resp);
  };

  getLicenses = () => {
    licenseService
      .getAllLicenses(this.state.activePage, 12)
      .then(this.getLicensesSuccess)
      .catch(this.getLicensesFail);
  };

  getLicensesSuccess = resp => {
    this.setState(prevState => {
      return {
        ...prevState,
        licenses: resp.item.pagedItems.map(this.licenseTemplate),
        totalItems: resp.item.totalCount
      };
    });
  };

  getLicensesFail = resp => {
    _logger(resp, "fail");
  };

  licenseTemplate = license => {
    return (
      <LicenseCard
        key={license.id}
        license={license}
        handleDelete={this.handleDelete}
        getLicenseById={this.getLicenseById}
        currentUser={this.state.currentUser}
      ></LicenseCard>
    );
  };
  handleDelete = license => {
    swal
      .fire({
        title: `Are you sure you want to delete license ${license.licenseNumber}? This is irreversible.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        confirmButtonColor: "#e60a31",
        cancelButtonColor: "#3085d6"
      })
      .then(result => {
        if (result.value) {
          licenseService
            .deleteLicense(license.id)
            .then(this.deleteSuccess)
            .catch(this.deleteFail);
        } else {
          swal.fire("Your file was saved.");
        }
      });
  };
  deleteSuccess = resp => {
    for (let i = 0; i < this.state.licenses.length; i++) {
      if (this.state.licenses[i].id === resp.id) {
        this.state.licenses.splice(i, 1);
        swal.fire(
          "Deleted!",
          "Your license has been successfully deleted",
          "success"
        );
      }
    }
    this.getLicenses();
  };
  deleteFail = resp => {
    _logger("failure", resp);
    swal.fire(
      "Error",
      "Something went wrong with deleting your file.",
      "error"
    );
  };
  handlePagination = page => {
    if (this.state.stateName > 0) {
      licenseService
        .getLicensesByState(page, 12, this.state.stateName)
        .then(this.getLicensesByState)
        .catch(this.getLicensesFail);
    } else if (this.state.searchString.length > 0) {
      licenseService
        .searchLicense(page, 12, this.state.searchString)
        .then(this.getSearchSuccess)
        .catch(this.getSearchFail);
    } else {
      licenseService
        .getAllLicenses(page, 12)
        .then(this.getLicensesSuccess)
        .catch(this.getLicensesFail);
    }
    this.setState(prevState => {
      return {
        ...prevState,
        activePage: page
      };
    });
  };
  renderPagination = () => {
    return (
      <Pagination
        onChange={this.handlePagination}
        current={this.state.activePage}
        total={this.state.totalItems}
      />
    );
  };

  getSearchResults = searchString => {
    licenseService
      .searchLicense(1, 12, searchString)
      .then(this.getSearchSuccess)
      .catch(this.getSearchFail);
  };
  getSearchSuccess = resp => {
    this.setState(prevState => {
      return {
        ...prevState,
        licenses: resp.item.pagedItems.map(this.licenseTemplate),
        totalItems: resp.item.totalCount
      };
    });
  };
  getSearchFail = resp => {
    _logger("SEARCH FAIL", resp);
  };
  handleSearch = e => {
    let name = e.target.name;
    let value = e.target.value;

    this.setState(
      prevState => {
        return {
          ...prevState,
          [name]: value
        };
      },
      () => {
        this.state.searchString.length > 0
          ? this.getSearchResults(this.state.searchString)
          : this.getLicenses(1, 12);
      }
    );
  };

  handleStateChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState(prevState => {
      return {
        ...prevState,
        [name]: value
      };
    });
    if (value > 0) {
      this.getLicensesByState(value);
    } else {
      this.getLicenses();
    }
  };
  getLicensesByState = stateId => {
    licenseService
      .getLicensesByState(1, 12, stateId)
      .then(this.getByStateSuccess)
      .catch(this.getByStateFail);
  };
  getByStateSuccess = resp => {
    this.setState(prevState => {
      return {
        ...prevState,
        activePage: 1,
        licenses: resp.item.pagedItems.map(this.licenseTemplate),
        searchString: "",
        totalItems: resp.item.totalCount
      };
    });
  };
  getByStateFail = resp => {
    _logger(resp);
    this.setState(prevState => {
      return {
        ...prevState,
        searchString: "",
        stateName: 0
      };
    });
    swal.fire({
      title: "No results found!",
      text: "There seems to be no provider licenses in your state",
      icon: "error"
    });
  };
  getCurrentLicenses = () => {
    licenseService
      .getCurrent(this.state.activePage, 12)
      .then(this.getCurrentSuccess)
      .catch(this.getCurrentFail);
  };
  getCurrentSuccess = resp => {
    _logger("GET CURRENT SUCCESS", resp);
  };
  getCurrentFail = resp => {
    _logger("GET CURRENT FAIL", resp);
  };

  getAuth = () => {
    authService
      .getCurrentUser()
      .then(this.getAuthSuccess)
      .catch(this.getAuthFail);
  };
  getAuthSuccess = user => {
    _logger(user);
    this.setState(prevState => {
      return {
        ...prevState,
        currentUser: user.item.id
      };
    });
    this.getLicenses();
  };
  getAuthFail = resp => {
    _logger("Current user fail", resp);
  };

  getLicenseById = license => {
    let activeId = license.id;
    licenseService
      .getLicenseById(activeId)
      .then(this.getLicenseByIdSuccess)
      .catch(this.getLicenseByIdFail);
  };

  getLicenseByIdSuccess = resp => {
    _logger("GOT ID", resp);
    this.props.history.push(`/licenses/${resp.item.id}/edit`);
  };
  getLicenseByIdFail = resp => {
    _logger("DID NOT GET ID", resp);
  };
  render() {
    return (
      <React.Fragment>
        <div className="jumbotron jumbotron-fluid">
          <div className="container-fluid">
            <h1 className="display-3">Licenses</h1>
          </div>
        </div>
        <div className="row top-row">
          <div className="col-lg-4">
            <NavLink className="btn btn-success new-license" to="/licenses/new">
              Add New License
            </NavLink>
          </div>
          <div className="col-lg-8">
            <input
              className="form-control mb-2 search"
              placeholder="Search by name or license number"
              value={this.state.searchString}
              name="searchString"
              onChange={this.handleSearch}
            ></input>
            <select
              className="custom-select search"
              value={this.state.stateName}
              name="stateName"
              onChange={this.handleStateChange}
            >
              <option value="">All States</option>
              {this.state.stateOptions}
            </select>
          </div>
        </div>
        <div className="row">{this.state.licenses}</div>
        <div className="row">
          <div className="col paginate">{this.renderPagination()}</div>
        </div>
      </React.Fragment>
    );
  }
}
Licenses.propTypes = {
  history: propTypes.shape({ push: propTypes.func, goBack: propTypes.func })
};
