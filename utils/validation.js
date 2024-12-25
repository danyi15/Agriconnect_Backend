exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

exports.validatePhoneNumber = (phone) => {
  const phoneRegex = /^([0-9]{10,15})$/;
  return phoneRegex.test(phone);
};
