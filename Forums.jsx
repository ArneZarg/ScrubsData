import React from "react";
import * as forumService from "../../services/forumService";
import logger from "debug";
import ForumCard from "./ForumCard";
import propTypes from "prop-types";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./forum.css";
import * as authService from "../../services/authService";
import swal from "sweetalert2";

const _logger = logger.extend("Forums");

export default class Forums extends React.Component {
  state = {
    threads: [],
    threadObjects: [],
    activePage: 1,
    formData: { subject: "" },
    currentUser: 0,
    activeId: 0,
    totalItems: 0
  };
  componentDidMount() {
    this.getThreads();
    this.getAuth();
  }
  renderPagination = () => {
    return (
      <Pagination
        total={this.state.totalItems}
        onChange={this.handlePagination}
        current={this.state.activePage}
      ></Pagination>
    );
  };
  handlePagination = page => {
    _logger(page);
    forumService
      .getThreads(page, 10)
      .then(this.getThreadsSuccess)
      .catch(this.getThreadsFail);
    this.setState(prevState => {
      return {
        ...prevState,
        activePage: page
      };
    });
  };
  getThreads = () => {
    forumService
      .getThreads(this.state.activePage, 10)
      .then(this.getThreadsSuccess)
      .catch(this.getThreadsFail);
  };
  getThreadsSuccess = response => {
    _logger(response.item.totalCount);

    this.setState(prevState => {
      return {
        ...prevState,
        threads: response.item.pagedItems.map(this.forumCardTemplate),
        threadObjects: response.item.pagedItems,
        totalItems: response.item.totalCount
      };
    });
    _logger(this.state.threadObjects);
  };
  getThreadsFail = response => {
    _logger(response);
  };
  getThreadById = thread => {
    forumService
      .getThreadById(thread.id)
      .then(this.getThreadByIdSuccess)
      .catch(this.getThreadByIdFail);
  };
  getThreadByIdSuccess = payload => {
    this.props.history.push(`forum/${payload.item.id}`);
  };
  deleteThreadById = thread => {
    forumService
      .deleteThread(thread.id)
      .then(this.deleteSuccess)
      .catch(this.deleteFail);
  };
  deleteSuccess = res => {
    this.setState(prevState => {
      const threadObjs = prevState.threadObjects.filter(
        item => item.id !== res
      );
      return {
        ...prevState,
        threadObjs,
        threads: threadObjs.map(this.forumCardTemplate)
      };
    });
    swal.fire("Deleted!", "This thread was deleted", "success");
    this.getThreads();
  };
  deleteFail = resp => {
    _logger(resp);
  };
  handleDelete = thread => {
    this.deleteThreadById(thread);
  };
  getThreadByIdFail = payload => {
    debugger;
    _logger(payload);
  };
  createNewThread = thread => {
    forumService
      .createNewThread(thread)
      .then(this.createNewSuccess)
      .catch(this.createNewFail);
  };
  createNewSuccess = thread => {
    _logger(thread);
    this.state.threadObjects.push(thread);
    this.getThreads();
    let element = document.getElementById("threadForm");
    element.classList.remove("show");
  };

  createNewFail = response => {
    _logger("failed to create", response);
  };
  handleSubmit = e => {
    e.preventDefault();
    let thread = {};
    if (this.state.activeId === 0) {
      thread = {
        subject: this.state.formData.subject,
        isActive: true
      };
      if (this.state.formData.subject === "") {
        swal.fire(
          "Error",
          "Something went wrong. Make sure you have a subject.",
          "error"
        );
      } else {
        this.createNewThread(thread);
      }
    } else {
      thread = {
        id: this.state.activeId,
        subject: this.state.formData.subject,
        isActive: true
      };
      this.editThread(thread);
    }

    document.getElementById("threadInput").value = "";
    let element = document.getElementById("threadForm");
    element.classList.remove("show");
    _logger(this.state.formData);
  };
  forumCardTemplate = thread => {
    return (
      <ForumCard
        key={"0" + thread.id}
        thread={thread}
        localClick={this.getThreadById}
        localEdit={this.setActiveId}
        location={this.props.match.params.id}
        handleDelete={this.handleDelete}
      ></ForumCard>
    );
  };
  showForm = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        activeId: 0,
        formData: {
          ...prevState.formData,
          subject: ""
        }
      };
    });
    document.getElementById("threadInput").value = "";
    let element = document.getElementById("threadForm");
    element.classList.add("show");
  };
  hideForm = e => {
    e.preventDefault();
    let element = document.getElementById("threadForm");
    element.classList.remove("show");
  };
  handleChange = e => {
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
  };
  getAuthFail = resp => {
    _logger("Current user fail", resp);
  };
  setActiveId = thread => {
    let activeId = thread.id;
    window.scrollTo(0, 0);
    forumService
      .getThreadById(activeId)
      .then(this.setActiveIdSuccess)
      .catch(this.getThreadByIdFail);
  };
  setActiveIdSuccess = thread => {
    _logger(thread);
    this.setState(prevState => {
      return {
        ...prevState,
        activeId: thread.item.id,
        formData: {
          ...prevState.formData,
          subject: thread.item.subject
        }
      };
    });
    let element = document.getElementById("threadForm");
    element.classList.add("show");
    document.getElementById("threadInput").value = this.state.formData.subject;
  };
  editThread = thread => {
    forumService
      .editThread(thread)
      .then(this.editThreadSuccess)
      .catch(this.editThreadFail);
  };
  editThreadSuccess = resp => {
    _logger("edited", resp);
    this.getThreads();
  };
  editThreadFail = resp => {
    _logger("fail", resp);
  };
  render() {
    return (
      <React.Fragment>
        <div className="container">
          <h1>ScrubsData Forum</h1>
          <hr></hr>
          <div className="row">
            <div className="col mb-3">
              <button className="btn btn-success" onClick={this.showForm}>
                Start New Thread
              </button>
            </div>
          </div>
          <div className="row mb-1" id="threadForm">
            <div className="col">
              <form>
                <div className="form-group">
                  <label>Subject or Question</label>
                  <input
                    id="threadInput"
                    value={this.state.subject}
                    type="text"
                    className="form-control"
                    name="subject"
                    onChange={this.handleChange}
                  />
                  <br></br>
                  <button
                    className="btn btn-success mr-3"
                    onClick={this.handleSubmit}
                  >
                    Submit
                  </button>
                  <button className="btn btn-secondary" onClick={this.hideForm}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="row">{this.state.threads}</div>
          <div className="row mt-3">
            <div className="col paginate">{this.renderPagination()}</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
Forums.propTypes = {
  history: propTypes.shape({ push: propTypes.func, goBack: propTypes.func }),
  match: propTypes.shape({ params: propTypes.shape({ id: propTypes.string }) })
};
