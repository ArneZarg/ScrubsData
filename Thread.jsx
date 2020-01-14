import React from "react";
import propTypes from "prop-types";
import ForumCard from "./ForumCard";
import * as forumService from "../../services/forumService";
import logger from "debug";

const _logger = logger.extend("Thread");
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
