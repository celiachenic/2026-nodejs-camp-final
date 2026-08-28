const createError = require("../utils/createError");
const appDataSource = require("../db/dataSource");
const userSchema = require("../db/entities/User");
const coachSchema = require("../db/entities/Coach");
const skillSchema = require("../db/entities/Skill");
const isUuid = require("../utils/isUuid");

//升級使用者成教練
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
    console.error(error);
    return next(createError(500, "升級失敗"));
  }
};

//取得教練本人後台資料
const getProfile = async (req, res, next) => {
  try {
    const coach = req.coach;
    const coachRepo = appDataSource.getRepository(coachSchema);
    const coachData = await coachRepo.findOne({
      where: {
        id: coach.id,
      },
      relations: { skills: true },
    });
    if (!coachData) {
      return next(createError(500, "教練查詢失敗"));
    }
    const { id, experience_years, description, profile_image_url } = coachData;

    const skill_ids = coachData.skills.map((skill) => skill.id);
    return res.status(200).json({
      status: "success",
      data: {
        id,
        experience_years,
        description,
        profile_image_url,
        skill_ids,
      },
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, "教練查詢失敗"));
  }
};

// 更新教練資料
const updateProfile = async (req, res, next) => {
  try {
    const coach = req.coach;
    const { experience_years, description, profile_image_url, skill_ids } =
      req.body;

    // experience_years 不是 0 以上的整數
    // description 沒給或是空字串
    // profile_image_url 沒給、是空字串、或不是 https 開頭（⚠️ 這支是必填）
    // skill_ids 沒給、不是陣列、是空陣列
    if (
      !Number.isInteger(experience_years) ||
      experience_years < 0 ||
      typeof description !== "string" ||
      description.trim() === "" ||
      typeof profile_image_url !== "string" ||
      !profile_image_url.startsWith("https://") ||
      !Array.isArray(skill_ids) ||
      skill_ids.length === 0
    ) {
      return next(createError(400, "欄位未填寫正確"));
    }

    // skill_ids 元素不是有效的 uuid 字串
    const skillRepo = appDataSource.getRepository(skillSchema);
    if (skill_ids.some((skill) => !isUuid(skill))) {
      return next(createError(400, "欄位未填寫正確"));
    }
    //確認是否為資料庫有效 skill ID
    const skills = [];
    for (const id of skill_ids) {
      const skill = await skillRepo.findOneBy({ id });
      if (!skill) {
        return next(createError(400, "欄位未填寫正確"));
      }
      skills.push(skill);
    }
    const coachRepo = appDataSource.getRepository(coachSchema);
    coach.experience_years = experience_years;
    coach.description = description.trim();
    coach.profile_image_url = profile_image_url.trim();
    coach.skills = skills;
    await coachRepo.save(coach);

    return res.status(200).json({
      status: "success",
      data: {
        id: coach.id,
        experience_years,
        description: description.trim(),
        profile_image_url: profile_image_url.trim(),
        skill_ids,
      },
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, "更新教練資料失敗"));
  }
};

module.exports = { updateUserToCoach, getProfile, updateProfile };
