import React from "react";
import propTypes from "prop-types";
import * as moment from "moment";
import Posts from "./Posts";
const ForumCard = props => {
  const goToThread = e => {
    e.preventDefault();
    props.localClick(props.thread);
  };
  const onLocalDelete = () => {
    props.handleDelete(props.thread);
  };
  const onLocalEdit = () => {
    props.localEdit(props.thread);
  };

  return (
    <React.Fragment>
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className={props.location ? "col" : "col-6"}>
                <h4>
                  <strong>Subject:</strong> {props.thread.subject}
                </h4>
                <p>
                  <strong>Posted on:</strong>{" "}
                  {moment(props.thread.dateCreated).format("LL")}
                </p>
                {props.location ? (
                  <Posts location={props.location}></Posts>
                ) : (
                  <React.Fragment>
                    <button
                      className="btn btn-primary mr-3"
                      onClick={goToThread}
                    >
                      Read
                    </button>
                    <button
                      className="btn btn-success mr-3"
                      onClick={onLocalEdit}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-secondary mr-3"
                      onClick={onLocalDelete}
                    >
                      Delete
                    </button>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
ForumCard.propTypes = {
  thread: propTypes.shape({
    id: propTypes.number,
    subject: propTypes.string,
    isActive: propTypes.bool,
    createdBy: propTypes.number,
    dateCreated: propTypes.string
  }),
  localClick: propTypes.func,
  location: propTypes.string,
  handleDelete: propTypes.func,
  localEdit: propTypes.func
};

export default ForumCard;
