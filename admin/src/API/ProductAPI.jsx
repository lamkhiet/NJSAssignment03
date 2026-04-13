import axiosClient from "./axiosClient";

const ProductAPI = {
  getAPI: () => {
    const url = "/products";
    return axiosClient.get(url);
  },

  getCategory: (query) => {
    const url = `/products/category${query}`;
    return axiosClient.get(url);
  },

  getDetail: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },

  getPagination: (query) => {
    const url = `/products/pagination${query}`;
    return axiosClient.get(url);
  },
  postCreate: (data) => {
    const url = "/products/create";

    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  putUpdate: (id, body) => {
    const url = `/products/update/${id}`;
    return axiosClient.put(url, body);
  },

  deleteProduct: (id) => {
    const url = `/products/delete/${id}`;
    return axiosClient.delete(url);
  },
};

export default ProductAPI;
