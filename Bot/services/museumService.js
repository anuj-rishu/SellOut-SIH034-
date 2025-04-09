const axios = require("axios");

async function searchMuseumsByPincode(pincode) {
    try {
        const response = await axios.get(
            `https://museum-api-indian.vercel.app/api/museums/nearby/pincode/${pincode}`
        );
        return response.data;
    } catch (error) {
        console.error("Error searching for museums:", error);
        throw error;
    }
}

async function bookMuseum(museum, token) {
    try {
        const response = await axios.post(
            "http://localhost:9000/api/booking/book",
            {
                museumName: museum.Museum_Name,
                museumPincode: museum.PIN_Code,
                museumAddress: museum.Address,
                city: museum.City,
                state: museum.State,
                openingHours: museum.Opening_Hours,
                closingHours: museum.Closing_Hours,
                contactEmail: museum.Contact_Email,
                phoneNumber: museum.Phone_Number,
                fullAddress: museum.Full_Address,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error booking museum:", error.response?.data || error.message);
        throw error;
    }
}

module.exports = {
    searchMuseumsByPincode,
    bookMuseum,
};