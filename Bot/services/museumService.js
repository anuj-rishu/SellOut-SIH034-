const axios = require("axios");
const config = require("../config/config");

class MuseumService {
  async searchByPincode(pincode) {
    try {
      const response = await axios.get(
        `https://museum-api-indian.vercel.app/api/museums/nearby/pincode/${pincode}`
      );
      return response.data;
    } catch (error) {
      console.error("Museum search error:", error.response?.data || error.message);
      return { success: false, totalCount: 0, museums: [], message: "Error searching museums" };
    }
  }

  async bookTicket(museumData, token) {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/booking/book`,
        museumData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      return error.response?.data || { success: false, message: "Booking failed" };
    }
  }
}

// Make sure to export the class instance, not just the class definition
module.exports = new MuseumService();