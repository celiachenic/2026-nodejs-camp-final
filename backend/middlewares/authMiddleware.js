const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const appDataSource = require("../db/dataSource");
const userSchema = require("../db/entities/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError(401, "請先登入"));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(createError(401, "請先登入"));
    }

    const SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, SECRET);

    //即使通過 authMiddleware (token 有效但未過期)，但有可能該帳號並不存在 (eg. 已刪除)
    const { id } = decoded;
    const userRepo = appDataSource.getRepository(userSchema);
    const user = await userRepo.findOneBy({ id });
    if (!user) {
      return next(createError(401, "使用者不存在，請重新登入"));
    }

    //確認 token 和使用者都沒問題後再把資料掛回req.user
    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Token 已過期"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(createError(401, "無效的 token"));
    }

    console.error(error);
    return next(createError(500, "驗證登入狀態失敗"));
  }
};

module.exports = authMiddleware;
