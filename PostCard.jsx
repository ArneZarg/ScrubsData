import React from "react";
import PropTypes from "prop-types";
import ReplyCard from "./ReplyCard";
import * as replyservice from "../../services/forumService";
import logger from "sabio";
import "./forum.css";

const _logger = logger.extend("PostCard");

class PostCard extends React.Component {
  state = {
    repliesRender: [],
    repliesData: [],
    formData: { content: "" }
  };

  componentDidMount() {
    replyservice
      .getReplyById(this.props.post.id)
      .then(this.getReplyByIdSuccess)
      .catch(this.getReplyByIdError);
  }

  toggleEditForm = () => {
    const form = document.getElementById(`edit-${this.props.post.id}`);
    const content = document.getElementById(`content-${this.props.post.id}`);
    form.classList.toggle("remove");
    content.classList.toggle("remove");
    document.getElementById(
      `textbox-${this.props.post.id}`
    ).value = this.props.post.content;
  };
  emptyTextBox = () => {
    document.getElementById(`textbox-${this.props.post.id}`).value = "";
  };
  prepareToEdit = () => {
    this.toggleEditForm();
    this.props.getPost(this.props.post);
  };
  editPost = () => {
    const postContent = `${
      document.getElementById(`textbox-${this.props.post.id}`).value
    }`;
    const post = {
      id: this.props.post.id,
      content: postContent
    };
    const form = document.getElementById(`edit-${this.props.post.id}`);
    const content = document.getElementById(`content-${this.props.post.id}`);
    form.classList.toggle("remove");
    content.classList.toggle("remove");
    this.props.localEdit(post);
    this.emptyTextBox();
  };
  deletePost = () => {
    this.props.localDelete(this.props.post.id);
  };
  getReplyByIdSuccess = ({ items }) => {
    _logger(items);
    this.setState(() => {
      return {
        repliesData: items,
        repliesRender: items.map(this.mapReply)
      };
    });
  };

  getReplyByIdError = response => {
    _logger("nothing", response);
  };
  deleteReply = id => {
    replyservice
      .deleteReply(id)
      .then(this.deleteReplySuccess)
      .catch(this.deleteFail);
  };
  deleteReplySuccess = response => {
    _logger(response);

    this.setState(prevState => {
      let index = prevState.repliesData.findIndex(plan => plan.id === response);
      let updatedReplies = [...prevState.repliesData];
      updatedReplies.splice(index, 1);
      return {
        ...prevState,
        repliesData: updatedReplies,
        repliesRender: updatedReplies.map(this.mapReply)
      };
    });
  };
  deleteFail = resp => {
    _logger(resp);
  };
  localReplyEdit = reply => {
    _logger(reply);
    replyservice
      .updateReply(reply)
      .then(this.editSuccess)
      .catch(this.editFail);
  };
  editSuccess = reply => {
    _logger(reply);
    replyservice
      .getReplyById(this.props.post.id)
      .then(this.getReplyByIdSuccess)
      .catch(this.getReplyByIdError);
  };
  editFail = resp => {
    _logger(resp);
  };
  getLocalReply = id => {
    replyservice
      .getSingleReply(id)
      .then(this.getLocalReplySuccess)
      .catch(this.getLocalReplyFail);
  };
  getLocalReplySuccess = reply => {
    _logger(reply);
  };
  getLocalReplyFail = response => {
    _logger(response);
  };
  mapReply = reply => {
    return (
      <ReplyCard
        key={`r-${reply.id}`}
        reply={reply}
        onDelete={this.deleteReply}
        onEdit={this.localReplyEdit}
        localClick={this.getLocalReply}
      />
    );
  };
  showReplyForm = () => {
    document
      .getElementById(`replyForm-${this.props.post.id}`)
      .classList.toggle("remove");
  };
  submitReply = () => {
    const reply = {
      ...this.state.formData,
      postId: this.props.post.id
    };
    replyservice
      .postReply(reply)
      .then(this.submitReplySuccess)
      .catch(this.submitReplyFail);
    this.discard();
  };
  submitReplySuccess = reply => {
    this.state.repliesData.push(reply);
    replyservice
      .getReplyById(this.props.post.id)
      .then(this.getReplyByIdSuccess)
      .catch(this.getReplyByIdError);
  };
  submitReplyFail = reply => {
    _logger(reply);
  };
  discard = () => {
    document
      .getElementById(`replyForm-${this.props.post.id}`)
      .classList.toggle("remove");
    document.getElementById(`replyForm-${this.props.post.id}`).value = "";
    this.setState({ formData: { content: "" } });
  };
  handleChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState(prevState => {
      return {
        ...prevState,
        formData: {
          ...prevState.formData,
          id: this.props.post.id,
          [name]: value
        }
      };
    });
  };
  render() {
    return (
      <React.Fragment>
        <li className="mt-5 ">
          <div className="col post-bg mb-5">
            <div className="row">
              <div className="col-12">
                <img
                  className="mb-3 shadow"
                  src={this.props.post.avatarUrl}
                  width={80}
                  alt="avatar"
                />
                <button
                  className="close-button btn btn-secondary"
                  onClick={this.deletePost}
                >
                  <strong>X</strong>
                </button>
              </div>
              <div className="col-12">
                <div
                  id={`edit-${this.props.post.id}`}
                  className="media-body remove"
                >
                  <textarea
                    id={`textbox-${this.props.post.id}`}
                    className="form-control"
                  />
                  <button
                    className="mt-3 mr-3 btn btn-success"
                    onClick={this.editPost}
                  >
                    Submit
                  </button>
                  <button
                    className="mt-3 btn btn-secondary"
                    onClick={this.toggleEditForm}
                  >
                    Discard Changes
                  </button>
                </div>
              </div>
              <div className="col-12">
                <div
                  id={`content-${this.props.post.id}`}
                  className="media-body"
                >
                  <p className="mt-0 mb-3">{this.props.post.content}</p>

                  <button
                    className="btn mr-3 btn-success"
                    onClick={this.prepareToEdit}
                  >
                    edit
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={this.showReplyForm}
                  >
                    reply
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-2"></div>
            <div
              className="col-10 card reply remove"
              id={`replyForm-${this.props.post.id}`}
            >
              <div className="">
                <div className="card-body">
                  <input
                    name="content"
                    value={this.state.formData.content}
                    className="form-control"
                    onChange={this.handleChange}
                  ></input>
                  <button
                    className="btn btn-primary mt-3 mr-3"
                    onClick={this.submitReply}
                  >
                    Submit Reply
                  </button>
                  <button
                    className="btn btn-secondary mt-3"
                    onClick={this.discard}
                  >
                    Discard
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">{this.state.repliesRender}</div>
        </li>

        <hr />
      </React.Fragment>
    );
  }
}

export default PostCard;

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    avatarUrl: PropTypes.string,
    threadId: PropTypes.number,
    createdBy: PropTypes.number,
    modifiedBy: PropTypes.number,
    dateCreated: PropTypes.string,
    dateModified: PropTypes.string
  }),
  getPost: PropTypes.func,
  localEdit: PropTypes.func,
  localDelete: PropTypes.func
};
