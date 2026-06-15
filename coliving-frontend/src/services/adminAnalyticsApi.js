import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/analytics";

const getToken = () => {
  return localStorage.getItem("token");
};

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const adminAnalyticsApi = {
  getOverview: () => axios.get(`${API_URL}/overview`, authConfig()),
  getUsers: () => axios.get(`${API_URL}/users`, authConfig()),
  getProperties: () => axios.get(`${API_URL}/properties`, authConfig()),
  getRooms: () => axios.get(`${API_URL}/rooms`, authConfig()),
  getBookings: () => axios.get(`${API_URL}/bookings`, authConfig()),
  getReviews: () => axios.get(`${API_URL}/reviews`, authConfig()),
  getConversations: () => axios.get(`${API_URL}/conversations`, authConfig()),
  getFeedback: () => axios.get(`${API_URL}/feedback`, authConfig()),

  getUsersTable: () => axios.get(`${API_URL}/tables/users`, authConfig()),
  getPropertiesTable: () => axios.get(`${API_URL}/tables/properties`, authConfig()),
  getRoomsTable: () => axios.get(`${API_URL}/tables/rooms`, authConfig()),
  getBookingsTable: () => axios.get(`${API_URL}/tables/bookings`, authConfig()),
  getReviewsTable: () => axios.get(`${API_URL}/tables/reviews`, authConfig()),
  getFeedbackTable: () => axios.get(`${API_URL}/tables/feedback`, authConfig()),
};