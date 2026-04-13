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

  postSignUp: (data) => {
    const url = `/users/signup`;
    return axiosClient.post(url, data);
  },
};

export default UserAPI;
