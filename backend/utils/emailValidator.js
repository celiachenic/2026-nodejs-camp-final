const emailValidator = (email) => {
  const regex =
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return regex.test(email); //回傳boolean
};

module.exports = emailValidator;
