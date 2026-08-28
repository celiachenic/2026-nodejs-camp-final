const appDataSource = require("../db/dataSource");
const coachSchema = require("../db/entities/Coach");
const createError = require("../utils/createError");
const requireCoach = async (req, res, next) => {
  try {
    const user = req.user;
    const coachRepo = appDataSource.getRepository(coachSchema);
    const coach = await coachRepo.findOneBy({
      user: { id: user.id },
    });
    if (!coach) {
      return next(createError(401, "使用者尚未成為教練"));
    }
    req.coach = coach;
    next();
  } catch (error) {
    console.log(error);
    return next(createError(500, "教練驗證失敗"));
  }
};

module.exports = requireCoach;
