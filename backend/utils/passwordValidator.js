//必須同時包含英文大寫、英文小寫、數字，長度 8～16 字。
const passwordValidator = (password) => {
  const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/;
  return regex.test(password); //回傳boolean
};

module.exports = passwordValidator;
