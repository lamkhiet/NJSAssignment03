import axiosClient from "./axiosClient";

const ChatRoomsAPI = {
  getMessageByRoomId: (roomId) => {
    const url = `/chatrooms/getById`;
    return axiosClient.get(url, {
      params: { roomId: roomId },
    });
  },

  createNewRoom: () => {
    const url = `/chatrooms/createNewRoom`;
    return axiosClient.post(url);
  },

  addMessage: (body) => {
    const url = `/chatrooms/addMessage`;
    return axiosClient.put(url, body);
  },
};

export default ChatRoomsAPI;
