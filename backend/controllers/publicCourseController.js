const createError = require("../utils/createError");
const appDataSource = require("../db/dataSource");
const courseSchema = require("../db/entities/Course");
const { LessThanOrEqual, MoreThan } = require("typeorm");

const getCourses = async (req, res, next) => {
  try {
    const courseRepo = appDataSource.getRepository(courseSchema);
    const courses = await courseRepo.find({
      where: {
        start_at: LessThanOrEqual(new Date()),
        end_at: MoreThan(new Date()),
      },
      relations: {
        coach: { user: true },
        skill: true,
      },
    });

    const coursesArray = [];
    for (const course of courses) {
      const { id, name, description, start_at, end_at, max_participants } =
        course;
      const coach_name = course.coach.user.name;
      const skill_name = course.skill.name;
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
    return res.status(200).json({
      status: "success",
      data: coursesArray,
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, "取得進行中課程列表失敗"));
  }
};
module.exports = { getCourses };
