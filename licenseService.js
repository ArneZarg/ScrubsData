import axios from "axios";
import * as serviceHelper from "./serviceHelpers";

const url = `${serviceHelper.API_HOST_PREFIX}/api/licenses`;

const getAllLicenses = (pageIndex, pageSize) => {
  const settings = {
    method: "GET",
    url: `${url}/paginate/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(settings)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const createNewLicense = license => {
  const settings = {
    method: "POST",
    url: `${url}`,
    withCredentials: true,
    crossdomain: true,
    data: license,
    headers: { "Content-Type": "application/json" }
  };
  return axios(settings)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const deleteLicense = id => {
  const settings = {
    method: "DELETE",
    url: `${url}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(settings)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const searchLicense = (pageIndex, pageSize, searchString) => {
  const settings = {
    method: "GET",
    url: `${url}/search/?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${searchString}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(settings)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};
const getLicensesByState = (pageIndex, pageSize, stateId) => {
  const settings = {
    method: "GET",
    url: `${url}/state/?pageIndex=${pageIndex}&pageSize=${pageSize}&stateId=${stateId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(settings)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getLicenseById = id => {
  const settings = {
    method: "GET",
    url: `${url}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(settings)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const editLicense = license => {
  const settings = {
    method: "PUT",
    url: `${url}/${license.id}`,
    data: license,
    id: license.id,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(settings)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getCurrent = (pageIndex, pageSize) => {
  const settings = {
    method: "GET",
    url: `${url}/current/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(settings)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

export {
  getAllLicenses,
  createNewLicense,
  deleteLicense,
  searchLicense,
  getLicensesByState,
  getLicenseById,
  editLicense,
  getCurrent
};
