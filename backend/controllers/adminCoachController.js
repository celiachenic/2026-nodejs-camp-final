const createError = require("../utils/createError");
const appDataSource = require("../db/dataSource");
const userSchema = require("../db/entities/User");
const coachSchema = require("../db/entities/Coach");
const isUuid = require("../utils/isUuid");

const updateUserToCoach = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!isUuid(userId)) {
      return next(createError(400, "使用者不存在"));
    }
    const { experience_years, description, profile_image_url } = req.body;
    //400 欄位缺漏或格式不對（experience_years 不是 0 以上的整數、description 是空字串、profile_image_url 有值但不是 https 開頭）→「欄位未填寫正確」
    if (
      !Number.isInteger(experience_years) ||
      experience_years < 0 ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      return next(createError(400, "欄位未填寫正確"));
    }

    if (profile_image_url != null && profile_image_url !== "") {
      if (
        typeof profile_image_url !== "string" ||
        !profile_image_url.startsWith("https://")
      ) {
        return next(createError(400, "欄位未填寫正確"));
      }
    }
    const userRepo = appDataSource.getRepository(userSchema);
    const user = await userRepo.findOneBy({
      id: userId,
    });
    // userId 查不到對應的使用者 →「使用者不存在」
    if (!user) {
      return next(createError(400, "使用者不存在"));
    }
    //該使用者已經是教練（重複升級）
    if (user.role === "COACH") {
      return next(createError(409, "使用者已經是教練"));
    }

    user.role = "COACH";
    await userRepo.save(user);

    const coachRepo = appDataSource.getRepository(coachSchema);
    const coach = coachRepo.create({
      user: {
        id: userId,
      },
      experience_years,
      description: description.trim(),
      profile_image_url: profile_image_url || null,
    });
    await coachRepo.save(coach);

    const updatedCoach = await coachRepo.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });
    return res.status(201).json({
      status: "success",
      data: {
        user: {
          name: updatedCoach.user.name,
          role: updatedCoach.user.role,
        },
        coach: {
          id: updatedCoach.id,
          user_id: updatedCoach.user.id,
          experience_years: updatedCoach.experience_years,
          description: updatedCoach.description,
          profile_image_url: updatedCoach.profile_image_url,
          created_at: updatedCoach.created_at,
          updated_at: updatedCoach.updated_at,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, "升級失敗"));
  }
};

module.exports = { updateUserToCoach };
