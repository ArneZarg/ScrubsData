import React from "react";
import propTypes from "prop-types";
import "./licenses.css";
import * as moment from "moment";

const LicenseCard = props => {
  const onLocalDelete = () => {
    props.handleDelete(props.license);
  };
  const onLocalEdit = e => {
    e.preventDefault();
    props.getLicenseById(props.license);
  };
  return (
    <React.Fragment>
      <div className="col-lg-3 col-md-6">
        <div className="card">
          <div className="license card-body">
            <h5 className="card-title">
              LicenseNumber: {props.license.licenseNumber}
            </h5>
            <hr></hr>
            <h6 className="card-subtitle">
              <strong>State: {props.license.state.name}</strong>
            </h6>
            <p className="card-text">
              <strong>Date Expires: </strong>
              <br></br>
              {moment(props.license.dateExpires).format("LL")}
              <br></br>
              <strong>Issued to:</strong>
              <br></br>
              {props.license.userProfile.firstName}{" "}
              {props.license.userProfile.lastName}
            </p>
            <div className="row license-card-button-row">
              {props.currentUser === props.license.createdBy ? (
                <React.Fragment>
                  <div className="col">
                    <button
                      className="license btn btn-success"
                      onClick={onLocalEdit}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="col">
                    <button
                      className="license btn btn-secondary"
                      onClick={onLocalDelete}
                    >
                      Delete
                    </button>
                  </div>
                </React.Fragment>
              ) : (
                <div className="col">
                  <h4>
                    This is not your license, and therefore you cannot edit or
                    delete it
                  </h4>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

LicenseCard.propTypes = {
  license: propTypes.shape({
    id: propTypes.number,
    licenseStateId: propTypes.number,
    createdBy: propTypes.number,
    dateCreated: propTypes.string,
    dateExpires: propTypes.string,
    dateModified: propTypes.string,
    licenseNumber: propTypes.string,
    state: propTypes.shape({
      id: propTypes.number,
      code: propTypes.string,
      name: propTypes.string,
      countryId: propTypes.number
    }),
    userProfile: propTypes.shape({
      avatarUrl: propTypes.string,
      createdBy: propTypes.number,
      dateCreated: propTypes.string,
      dateModified: propTypes.string,
      firstName: propTypes.string,
      id: propTypes.number,
      lastName: propTypes.string,
      mi: propTypes.string,
      modifiedBy: propTypes.number,
      userId: propTypes.number
    })
  }),
  handleDelete: propTypes.func,
  getLicenseById: propTypes.func,
  currentUser: propTypes.number
};

export default LicenseCard;
