import axios from "axios";
import * as serviceHelpers from "./serviceHelpers";

const url = `${serviceHelpers.API_HOST_PREFIX}/api/forums/`;
const postsGetByThreadId = (threadId, page, size) => {
  const config = {
    method: "GET",
    url: `${url}postsByThreadId/${threadId}/?pageIndex=${page}&pageSize=${size}`,
    withCredentials: true,
    crossDomain: true,
    header: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};
const postPost = payload => {
  const config = {
    method: "POST",
    url: `${url}posts`,
    withCredentials: true,
    crossDomain: true,
    data: payload,
    header: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const updatePost = payload => {
  const config = {
    method: "PUT",
    url: `${url}posts/${payload.id}`,
    withCredentials: true,
    crossDomain: true,
    data: payload,
    header: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const deletePost = id => {
  const config = {
    method: "DELETE",
    url: `${url}posts/${id}`,
    withCredentials: true,
    crossDomain: true
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const getAllPosts = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${url}posts/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossDomain: true
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const getPostsCreatedBy = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${url}posts/createdby?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossDomain: true
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const getPostById = id => {
  const config = {
    method: "GET",
    url: `${url}posts/${id}`,
    withCredentials: true,
    crossDomain: true
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};
const getThreads = (pageIndex, pageSize) => {
  const settings = {
    method: "GET",
    header: {
      "Content-Type": "application/json"
    },
    url: `${url}paginate/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true
  };
  return axios(settings)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const getThreadById = id => {
  const settings = {
    method: "GET",
    header: { "Content-Type": "application/json" },
    url: `${url}${id}`,
    withCredentials: true,
    crossdomain: true
  };
  return axios(settings)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const createNewThread = payload => {
  const settings = {
    method: "POST",
    header: { "Content-Type": "application/json" },
    url: `${url}`,
    withCredentials: true,
    crossdomain: true,
    data: payload
  };
  return axios(settings)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const deleteThread = id => {
  const settings = {
    method: "DELETE",
    header: { "Content-Type": "application/json" },
    url: `${url}${id}`,
    withCredentials: true,
    crossdomain: true
  };
  return axios(settings)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};
const editThread = thread => {
  const settings = {
    method: "PUT",
    header: { "Content-Type": "application/json" },
    url: `${url}${thread.id}`,
    withCredentials: true,
    data: thread,
    crossdomain: true
  };
  return axios(settings)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const postReply = payload => {
  const settings = {
    method: "POST",
    header: {
      "Content-Type": "application/json"
    },
    url: `${url}replies`,
    withCredentials: true,
    crossDomain: true,
    data: payload
  };
  return axios(settings)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const updateReply = payload => {
  const settings = {
    method: "PUT",
    header: {
      "Content-Type": "application/json"
    },
    url: `${url}replies/${payload.id}`,
    withCredentials: true,
    crossDomain: true,
    data: payload
  };
  return axios(settings)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const getReplyById = id => {
  const settings = {
    method: "GET",
    withCredentials: true,
    crossDomain: true,
    header: {
      "Content-Type": "application/json"
    },
    url: `${url}replies/postid/${id}`
  };
  return axios(settings)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const deleteReply = id => {
  const settings = {
    method: "DELETE",
    withCredentials: true,
    crossDomain: true,
    url: `${url}replies/${id}`
  };
  return axios(settings)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};
const getSingleReply = id => {
  const settings = {
    method: "GET",
    withCredentials: true,
    crossDomain: true,
    url: `${url}replies/${id}`
  };
  return axios(settings)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};
export {
  postPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostsCreatedBy,
  getPostById,
  getThreads,
  getThreadById,
  createNewThread,
  deleteThread,
  editThread,
  postReply,
  updateReply,
  getReplyById,
  deleteReply,
  postsGetByThreadId,
  getSingleReply
};
