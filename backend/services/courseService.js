const courseSchema = require("../db/entities/Course");
const getCoachCourses = async (coachId) => {
  const courseRepo = appDataSource.getRepository(courseSchema);
  const courses = await courseRepo.find({
    where: { coach: { id: coachId } },
  });
  return courses;
};

module.exports = { getCoachCourses };
