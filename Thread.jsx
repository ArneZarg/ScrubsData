import React from "react";
import propTypes from "prop-types";
import ForumCard from "./ForumCard";
import * as forumService from "../../services/forumService";
import logger from "sabio-debug";
const _logger = logger.extend("SabioInit");
export default class Thread extends React.Component {
  state = {
    posts: [],
    topic: ""
  };
  componentDidMount() {
    this.getThreadById();
  }
  getThreadById = () => {
    forumService
      .getThreadById(this.props.match.params.id)
      .then(this.getThreadByIdSuccess)
      .catch(this.getThreadByIdFail);
  };
  getThreadByIdSuccess = payload => {
    _logger(payload);
    this.setState(prevState => {
      return {
        ...prevState,
        topic: this.forumCardTemplate(payload.item)
      };
    });
  };
  getThreadByIdFail = payload => {
    _logger(payload);
  };
  backToForums = () => {
    this.props.history.push("/forum");
  };
  forumCardTemplate = thread => {
    return (
      <ForumCard
        key={thread.id}
        thread={thread}
        subject={thread.subject}
        location={this.props.match.params.id}
      />
    );
  };
  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row mb-3">
            <div className="col">
              <button className="btn btn-success" onClick={this.backToForums}>
                Back to Forums
              </button>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">{this.state.topic}</div>
        </div>
      </React.Fragment>
    );
  }
}
Thread.propTypes = {
  history: propTypes.shape({ push: propTypes.func, goBack: propTypes.func }),
  match: propTypes.shape({ params: propTypes.shape({ id: propTypes.string }) })
};
