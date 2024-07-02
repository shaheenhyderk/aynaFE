import axios from 'axios';

export const publicGateway = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_DOMAIN,
  headers: {
    'Content-Type': 'application/json'
  },
});

export const privateGateway = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_DOMAIN,
  headers: {
    'Content-Type': 'application/json'
  },

});

privateGateway.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export const connectPrivateSocket = ({ url }) => {
  let wsUrl = `${import.meta.env.VITE_BACKEND_DOMAIN_WS}${url}?Authorization=Bearer ${localStorage.getItem('accessToken')}`;

  return new Promise((resolve) => {
    const ws= new WebSocket(wsUrl);
    resolve(ws);
  });
};
