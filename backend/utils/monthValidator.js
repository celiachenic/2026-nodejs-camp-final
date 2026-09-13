const monthValidator = (month) => {
  const availableValues = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  return availableValues.includes(month);
};

module.exports = monthValidator;
