function isValidPincode(pincode) {
    return /^\d{6}$/.test(pincode);
}

module.exports = {
    isValidPincode,
};