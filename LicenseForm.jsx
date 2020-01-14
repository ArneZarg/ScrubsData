import React from "react";
import "./licenses.css";
import logger from "debug";
import * as licenseServices from "../../services/licenseService";
import swal from "sweetalert2";
import propTypes from "prop-types";
import { Formik, Field } from "formik";
import { Form, Button, FormGroup, Label } from "reactstrap";
import validate from "./licenseSchema";
import * as locationServices from "../../services/locationServices";
import LicenseCard from "./LicenseCard";
import Pagination from "rc-pagination";
import * as authService from "../../services/authService";

const _logger = logger.extend("Licenses");

export default class LicenseForm extends React.Component {
  state = {
    formData: {
      licenseStateId: 0,
      licenseNumber: "",
      dateExpires: ""
    },
    stateOptions: [],
    activeId: null,
    licenses: [],
    currentUser: 0,
    activePage: 1,
    totalItems: 0
  };

  componentDidMount() {
    this.getUser();
    this.getStates();

    /* if (this.props.match.params.id === null) {
      this.getFromId();
    } */
  }
  handlePagination = page => {
    licenseServices
      .getCurrent(page, 12)
      .then(this.getLicensesByUserSuccess)
      .catch(this.getLicensesByUserFail);
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
  getUser = () => {
    authService
      .getCurrentUser()
      .then(this.getUserSuccess)
      .catch(this.getFail);
  };
  getUserSuccess = user => {
    this.setState(prevState => {
      return {
        ...prevState,
        currentUser: user.item.id
      };
    });
    if (this.state.activeId === this.state.currentUser) {
      this.getLicensesByUser();
    }
  };
  getUserFail = resp => {
    _logger(resp);
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
          licenseServices
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
    this.getLicensesByUser();
  };
  deleteFail = resp => {
    _logger("failure", resp);
    swal.fire(
      "Error",
      "Something went wrong with deleting your file.",
      "error"
    );
  };
  getLicenseById = license => {
    let activeId = license.id;
    licenseServices
      .getLicenseById(activeId)
      .then(this.getLicenseByIdSuccess)
      .catch(this.getLicenseByIdFail);
  };

  getLicenseByIdSuccess = resp => {
    _logger("GOT ID", resp);
    this.props.history.push(`/licenses/${resp.item.id}/edit`);
    this.setState(prevState => {
      return {
        ...prevState,
        formData: {
          licenseStateId: resp.item.licenseStateId,
          licenseNumber: resp.item.licenseNumber,
          dateExpires: resp.item.dateExpires,
          id: resp.item.id
        },
        activeId: this.props.match.params.id
      };
    });
  };
  getLicenseByIdFail = resp => {
    _logger("DID NOT GET ID", resp);
  };
  getLicensesByUser = () => {
    _logger("launched");
    licenseServices
      .getCurrent(1, 12)
      .then(this.getLicensesByUserSuccess)
      .catch(this.getLicensesByUserFail);
  };
  getLicensesByUserSuccess = licenses => {
    _logger(licenses);
    this.setState(prevState => {
      return {
        ...prevState,
        licenses: licenses.item.pagedItems.map(this.licenseTemplate),
        totalItems: licenses.item.totalCount
      };
    });
  };

  getLicensesByUserFail = resp => {
    _logger("faillll", resp);
  };
  getFromId = () => {
    licenseServices
      .getLicenseById(this.props.match.params.id)
      .then(this.getSuccess)
      .catch(this.getFail);
  };
  getSuccess = license => {
    this.setState(prevState => {
      return {
        ...prevState,
        formData: {
          licenseStateId: license.item.licenseStateId,
          licenseNumber: license.item.licenseNumber,
          dateExpires: license.item.dateExpires,
          id: license.item.id
        },
        activeId: this.props.match.params.id
      };
    });
    _logger(this.state.formData);
  };
  getFail = resp => {
    _logger(resp);
  };
  createNewLicense = license => {
    licenseServices
      .createNewLicense(license)
      .then(this.createNewSuccess)
      .catch(this.createNewFail);
  };
  createNewSuccess = license => {
    swal.fire("New License Saved!");
    _logger("success", license);
    this.props.history.push("/licenses");
  };
  createNewFail = license => {
    swal.fire("Something went wrong.");
    _logger("failuureee", license);
  };
  onHandleChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState(prevState => {
      return {
        ...prevState,
        formData: {
          ...prevState.formData,
          [name]: value
        }
      };
    });
  };
  renderState = state => {
    return (
      <option key={state.id} value={state.id}>
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
  handleSubmit = license => {
    _logger("clicked");
    if (this.state.activeId !== null) {
      _logger("LICENSE:", license);
      this.editLicense(license);
    } else {
      this.createNewLicense(license);
    }
  };
  editLicense = license => {
    licenseServices
      .editLicense(license)
      .then(this.editSuccess)
      .catch(this.editFail);
  };
  editSuccess = license => {
    _logger("edited", license);
    swal.fire("License successfully edited.");
  };
  editFail = license => {
    _logger("DID NOT EDIT", license);
    swal.fire({
      title: "Error",
      icon: "error",
      text: "Unable to edit. Make sure everything is filled out correctly."
    });
  };
  render() {
    return (
      <React.Fragment>
        <Formik
          enableReinitialize={true}
          validationSchema={validate.licenseValidate}
          initialValues={this.state.formData}
          onSubmit={this.handleSubmit}
        >
          {props => {
            const { values, handleSubmit } = props;
            return (
              <div className="container">
                <div className="card-body">
                  <div className="jumbotron jumbotron-fluid">
                    <div className="container-fluid">
                      <h1 className="display-3">Licenses Form</h1>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <Form onSubmit={handleSubmit}>
                        <div className="form-row">
                          <FormGroup className="form-group col-md-4">
                            <Label>License Number</Label>
                            <Field
                              type="text"
                              className="form-control"
                              name="licenseNumber"
                              placeholder="License Number"
                              value={values.licenseNumber}
                            />
                          </FormGroup>
                          <FormGroup className="form-group col-lg-4 col-md-4">
                            <Label>State Issued</Label>
                            <Field
                              value={values.licenseStateId}
                              component="select"
                              name="licenseStateId"
                              className="custom-select mr-sm-2"
                              as="select"
                            >
                              <option value="">Select your state...</option>
                              {this.state.stateOptions}
                            </Field>
                          </FormGroup>
                          <FormGroup className="form-group col-md-4">
                            <Label>Expiration Date</Label>

                            <Field
                              type="date"
                              value={values.dateExpires.split("T", 1, 0)}
                              name="dateExpires"
                              as="date"
                              className="form-control"
                            />
                          </FormGroup>
                        </div>
                        <div className="form-row">
                          <div className="col">
                            <Button type="submit" className="btn btn-success">
                              Save
                            </Button>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        </Formik>
        {this.state.activeId === null ? (
          <div className="row"></div>
        ) : (
          <React.Fragment>
            <div className="row">{this.state.licenses}</div>
            <div className="row">
              <div className="col paginate">{this.renderPagination()}</div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
LicenseForm.propTypes = {
  history: propTypes.shape({ push: propTypes.func, goBack: propTypes.func }),
  match: propTypes.shape({ params: propTypes.shape({ id: propTypes.string }) })
};
