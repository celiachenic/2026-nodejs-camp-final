const createError = require("../utils/createError");
const appDataSource = require("../db/dataSource");
const coachSchema = require("../db/entities/Coach");
const isUuid = require("../utils/isUuid");

//取得教練分頁列表
const getCoaches = async (req, res, next) => {
  try {
    //per=6&page=1
    const per = Number(req.query.per);
    const page = Number(req.query.page);
    if (
      !Number.isInteger(per) ||
      per < 1 ||
      !Number.isInteger(page) ||
      page < 1
    ) {
      return next(createError(400, "欄位未填寫正確"));
    }
    const coachRepo = appDataSource.getRepository(coachSchema);

    const coaches = await coachRepo.find({
      relations: { user: true },
      skip: (page - 1) * per, // skip = OFFSET
      take: per, // take = LIMIT
      order: { id: "ASC" },
    });
    const coachesArray = [];
    for (const coach of coaches) {
      coachesArray.push({
        id: coach.id,
        user_id: coach.user.id,
        name: coach.user.name,
      });
    }

    return res.status(200).json({
      status: "success",
      data: coachesArray,
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, "取得教練列表失敗"));
  }
};

//取得單一教練詳細資料
const getCoach = async (req, res, next) => {
  try {
    const { coachId } = req.params;
    if (typeof coachId !== "string" || coachId.trim() === "") {
      return next(createError(400, "欄位未填寫正確"));
    }

    if (!isUuid(coachId)) {
      return next(createError(400, "找不到該教練"));
    }
    const coachRepo = appDataSource.getRepository(coachSchema);
    const coach = await coachRepo.findOne({
      where: { id: coachId },
      relations: { user: true, skills: true },
    });
    if (!coach) {
      return next(createError(400, "找不到該教練"));
    }
    const {
      user,
      id,
      experience_years,
      description,
      profile_image_url,
      created_at,
      updated_at,
      skills,
    } = coach;

    const skillsArray = [];
    for (const skill of skills) {
      skillsArray.push(skill.name);
    }
    return res.status(200).json({
      status: "success",
      data: {
        user: {
          name: user.name,
          role: user.role,
        },
        coach: {
          id,
          user_id: user.id,
          experience_years,
          description,
          profile_image_url,
          created_at,
          updated_at,
          skills: skillsArray,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, "取得單一教練詳細資料失敗"));
  }
};

//取得指定教練未結束的課程列表
const getCoachCourses = async (req, res, next) => {
  try {
    const { coachId } = req.params;
    if (typeof coachId !== "string" || coachId.trim() === "") {
      return next(createError(400, "欄位未填寫正確"));
    }

    if (!isUuid(coachId)) {
      return next(createError(400, "找不到該教練"));
    }
    const coachRepo = appDataSource.getRepository(coachSchema);
    const coach = await coachRepo.findOne({
      where: { id: coachId },
      relations: { user: true, courses: { skill: true } },
    });
    if (!coach) {
      return next(createError(400, "找不到該教練"));
    }

    const { courses } = coach;
    const coursesArray = [];
    for (const course of courses) {
      const { id, name, description, start_at, end_at, max_participants } =
        course;
      const coach_name = coach.user.name;
      const skill_name = course.skill.name;
      if (new Date(end_at).getTime() > Date.now()) {
        coursesArray.push({
          id,
          name,
          description,
          start_at,
          end_at,
          max_participants,
          coach_name,
          skill_name,
        });
      }
    }
    return res.status(200).json({
      status: "success",
      data: coursesArray,
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, "取得指定教練未結束的課程列表失敗"));
  }
};
module.exports = { getCoaches, getCoach, getCoachCourses };
