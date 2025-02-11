const validatePhoneNumber = (number) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(number);
};
 module.exports= {validatePhoneNumber}