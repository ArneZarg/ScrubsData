import React from "react";
import PostCard from "./PostCard";
import * as postservice from "../../services/forumService";
import logger from "debug";
import propTypes from "prop-types";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import "./forum.css";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

const _logger = logger.extend("Posts");

class Posts extends React.Component {
  state = {
    postsRender: [],
    postsData: [],
    formData: {},
    activePage: 1,
    activeId: 0,
    totalItems: 0
  };

  componentDidMount() {
    this.getPostsByThread(parseInt(this.props.location), 0, 5);
  }

  getAllPostsSuccess = ({ item }) => {
    _logger(item.totalItems);
    this.setState(() => {
      return {
        postsData: item.pagedItems,
        postsRender: item.pagedItems.map(this.mapPosts)
      };
    });
  };

  getAllPostError = () => {
    _logger("error on get all post");
  };

  getPostsByThread = (id, page, size) => {
    postservice
      .postsGetByThreadId(id, page, size)
      .then(this.getThreadPostsSuccess)
      .catch(this.getThreadPostsFailure);
  };
  getThreadPostsSuccess = ({ item }) => {
    _logger("TOTAL ITEMS", item.totalCount);
    this.setState(() => {
      return {
        postsData: item.pagedItems,
        postsRender: item.pagedItems.map(this.mapPosts),
        totalItems: item.totalCount
      };
    });
  };
  getThreadPostsFailure = response => {
    _logger(response);
  };
  createNewPost = post => {
    postservice
      .postPost(post)
      .then(this.createNewPostSuccess)
      .catch(this.createNewPostFail);
  };
  createNewPostSuccess = post => {
    _logger(post);
    this.state.postsData.push();
    this.getPostsByThread(
      parseInt(this.props.location),
      this.state.activePage,
      5
    );
  };
  createNewPostFail = response => {
    _logger(response);
  };
  handleChange = e => {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(prevState => {
      return {
        ...prevState,
        formData: {
          ...prevState.formData,
          [name]: value,
          threadId: parseInt(this.props.location)
        }
      };
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.createNewPost(this.state.formData);
    this.setState({ formData: { subject: "" } });
    document.getElementById("createPost").value = "";
  };
  selectPostById = post => {
    postservice
      .getPostById(post.id)
      .then(this.selectByIdSuccess)
      .catch(this.selectPostFail);
  };
  selectByIdSuccess = post => {
    this.setState({ activeId: post.item.id });
  };
  selectPostFail = error => {
    _logger(error);
  };
  editPost = post => {
    postservice
      .updatePost(post)
      .then(this.editSuccess)
      .catch(this.editFail);
  };
  editSuccess = post => {
    _logger(post);
    this.getPostsByThread(this.props.location, this.state.activePage, 5);
  };
  editFail = error => {
    _logger(error);
  };
  onLocalDelete = id => {
    postservice
      .deletePost(id)
      .then(this.onDeleteSuccess)
      .catch(this.onDeleteFail);
  };
  onDeleteSuccess = response => {
    _logger(response);
    this.getPostsByThread(this.props.location, this.state.activePage, 5);
  };
  onDeleteFail = response => {
    _logger(response);
  };
  mapPosts = post => {
    return (
      <PostCard
        key={`p-${post.id}`}
        post={post}
        getPost={this.selectPostById}
        localEdit={this.editPost}
        localDelete={this.onLocalDelete}
      />
    );
  };
  renderPagination = () => {
    _logger("I am made");
    _logger(this.state.activePage);
    return (
      <Pagination
        total={this.state.totalItems}
        onChange={this.handlePagination}
        current={this.state.activePage}
        defaultPageSize={5}
      ></Pagination>
    );
  };
  handlePagination = page => {
    _logger("page", page);
    postservice
      .postsGetByThreadId(parseInt(this.props.location), page - 1, 5)
      .then(this.getThreadPostsSuccess)
      .catch(this.getThreadPostsFailure);

    this.setState(prevState => {
      return {
        ...prevState,
        activePage: page
      };
    });
  };
  render() {
    return (
      <React.Fragment>
        <div className="col">
          <ul className="list-unstyled">{this.state.postsRender}</ul>
          <div className="row mt-3 mb-3">
            <div className="col">{this.renderPagination()}</div>
          </div>
          <hr />
          <Form onChange={this.handleChange} onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="createPost">Write Post</Label>
              <Input
                type="textarea"
                name="content"
                value={this.state.formData.content}
                id="createPost"
              />
              <br />
              <Button className="float-right" type="submit">
                Post
              </Button>
            </FormGroup>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}
Posts.propTypes = {
  location: propTypes.string
};
export default Posts;
