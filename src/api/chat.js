import { connectPrivateSocket, privateGateway } from "../../services/apiGateway.js";
import { endpoints } from "../../services/apis.js";
import toast from "react-hot-toast";

export const listRooms = () => {
  return privateGateway
    .get(endpoints.listRooms())
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      toast.error(error.response.data.error.message);
    });
};

export const listMessages = (roomId) => {
  return privateGateway
    .get(endpoints.listMessages(roomId))
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      toast.error(error.response.data.error.message);
    });
};

export const createRoom = (roomName) => {
  const data = {
    data: {
      name: roomName,
    },
  };

  return privateGateway
    .post(endpoints.createRoom(), data)
    .then((response) => {
      toast.success("Room created successfully");
      return response.data;
    })
    .catch((error) => {
      toast.error(error.response.data.error.message);
    });
};

export const connectToRoom = (roomId) => {
  return connectPrivateSocket({ url: endpoints.messageWS(roomId) });
};
