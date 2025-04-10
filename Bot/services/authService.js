const axios = require("axios");
const config = require("../config/config");

class AuthService {
  async register(userData) {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/auth/register`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      return error.response?.data || { success: false, message: "Server error" };
    }
  }

  async login(credentials) {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/auth/login`,
        credentials
      );
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return error.response?.data || { success: false, message: "Server error" };
    }
  }
}

module.exports = new AuthService();