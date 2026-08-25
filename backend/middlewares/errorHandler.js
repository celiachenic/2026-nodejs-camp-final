const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "伺服器錯誤";
  return res.status(statusCode).json({
    status: "failed",
    message: errorMessage,
  });
};

module.exports = errorHandler;
