import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://evangadi-forum-backend-latest.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      // Remove the window.location.href redirect to prevent navigation issues
      // The ProtectedRoute component will handle redirecting unauthenticated users
    }
    return Promise.reject(error);
  }
);

// Question API
export const questionsAPI = {
  getAllQuestions: () => axiosInstance.get("/api/question"),
  getQuestionById: (id) => axiosInstance.get(`/api/question/${id}`),
  updateQuestion: (id, data) => axiosInstance.put(`/api/question/${id}`, data),
  deleteQuestion: (id) => axiosInstance.delete(`/api/question/${id}`)
};

// Move updateAnswer inside the answersAPI object
export const answersAPI = {
  getAnswersByQuestionId: (questionId) =>
    axiosInstance.get(`/api/answer/${questionId}`),
  postAnswer: (answerData) => axiosInstance.post("/api/answer", answerData),
  voteAnswer: (data) => axiosInstance.post("/api/answer/vote", data),
  updateAnswer: (answerid, data) =>
    axiosInstance.put(`/api/answer/${answerid}`, data),
  deleteAnswer: (answerid) => axiosInstance.delete(`/api/answer/${answerid}`),

};

// Profile API
export const profileAPI = {
  getProfile: () => axiosInstance.get("/api/users/profile"),
  updateProfile: (profileData) => axiosInstance.put("/api/users/profile", profileData),
  updateProfilePicture: (profilePicUrl) => 
    axiosInstance.put("/api/users/profile/picture", { profilePicUrl }),
};

// Auth API
export const authAPI = {
  login: (credentials) => axiosInstance.post("/api/users/login", credentials),
};

export default axiosInstance;
