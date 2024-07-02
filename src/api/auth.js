import {publicGateway} from "../../services/apiGateway.js";
import {endpoints} from "../../services/apis.js";
import toast from "react-hot-toast";

export const loginApi = (email, password) => {

  const data = {
    identifier: email,
    password: password,
  };

  return publicGateway
    .post(endpoints.login(), data, )
    .then((response) => {
      toast.success("Successfully logged in");
      localStorage.setItem('accessToken', response.data.jwt);
      localStorage.setItem('username', response.data.user.username);
      return response
    })
    .catch((error) => {
      toast.error(error.response.data.error.message);
      throw new Error(error.response.data.error.message);
    });
};


export const registerApi = (username, email, password) => {

  const data = {
    username: username,
    email: email,
    password: password,
  };

  return publicGateway
    .post(endpoints.register(), data, )
    .then((response) => {
      toast.success("Successfully registered");
      localStorage.setItem('accessToken', response.data.jwt);
      return response
    })
    .catch((error) => {
      toast.error(error.response.data.error.message);
      throw new Error(error.response.data.error.message);
    });
};
