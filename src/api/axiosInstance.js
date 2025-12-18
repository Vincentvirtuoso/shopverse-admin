import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- Global handlers (connected by AuthContext) ----
let onUnauthorizedLogout = null;
let onTryRefresh = null;

export const setUnauthorizedLogoutHandler = (cb) => {
  onUnauthorizedLogout = cb;
};

export const setRefreshHandler = (cb) => {
  onTryRefresh = cb;
};

// ---- 401 Interceptor ----
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed() {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (!err.response) {
      console.warn("Network offline or server unreachable");
      return Promise.reject(err);
    }

    if (err.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber(() => {
            api(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        if (onTryRefresh) {
          await onTryRefresh();
        }
        isRefreshing = false;
        onRefreshed();
        return api(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        refreshSubscribers = [];
        console.warn("Token refresh failed, logging out...");
        if (onUnauthorizedLogout) {
          onUnauthorizedLogout();
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
