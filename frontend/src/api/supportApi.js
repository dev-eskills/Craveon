import api from '../utils/axios';

const BASE_URL = '/support';

const createFeedback = async (data) => {
  const response = await api.post(`${BASE_URL}/feedback`, data);
  return response.data;
};

const createComplaint = async (data) => {
  const response = await api.post(`${BASE_URL}/complaint`, data);
  return response.data;
};

const createDispute = async (data) => {
  const response = await api.post(`${BASE_URL}/dispute`, data);
  console.log("createDispute", response.data);
  return response.data;
};

const getUserSupportHistory = async () => {
  const response = await api.get(`${BASE_URL}/my-history`);
  return response.data;
};

const getAdminFeedback = async () => {
  const response = await api.get(`${BASE_URL}/feedback`);
  return response.data;
};

const getAdminComplaints = async () => {
  const response = await api.get(`${BASE_URL}/complaints`);
  return response.data;
};

const getAdminDisputes = async () => {
  const response = await api.get(`${BASE_URL}/disputes`);
  console.log("getAdminDisputes", response.data);
  return response.data;
};

const updateComplaint = async ({ id, status, adminNotes }) => {
  const response = await api.patch(`${BASE_URL}/complaints/${id}`, { status, adminNotes });
  return response.data;
};

const updateDispute = async ({ id, status, resolutionDetails }) => {
  const response = await api.patch(`${BASE_URL}/disputes/${id}`, { status, resolutionDetails });
  return response.data;
};

export const supportApi = {
  createFeedback,
  createComplaint,
  createDispute,
  getUserSupportHistory,
  getAdminFeedback,
  getAdminComplaints,
  getAdminDisputes,
  updateComplaint,
  updateDispute,
};
