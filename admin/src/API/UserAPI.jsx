import axiosClient from "./axiosClient";

const UserAPI = {
  getAllData: () => {
    const url = "/users";
    return axiosClient.get(url);
  },
  postLogin: (data) => {
    const url = "/users/login";
    return axiosClient.post(url, data);
  },
  getDetailData: (id) => {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },

  postSignUp: (query) => {
    const url = `/users/signup/${query}`;
    return axiosClient.post(url);
  },
  updateUser: (data) => {
    const url = `/users/update`;
    return axiosClient.post(url, data);
  },

  deleteUser: (id) => {
    const url = `/users/delete/${id}`;
    return axiosClient.delete(url);
  },
};

export default UserAPI;
