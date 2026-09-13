const appDataSource = require('../db/dataSource')
const courseSchema = require("../db/entities/Course");
const getCoursesByCoachId = async (coachId) => {
  const courseRepo = appDataSource.getRepository(courseSchema);
  const courses = await courseRepo.find({
    where: { coach: { id: coachId } },
  });
  return courses;
};

module.exports = { getCoursesByCoachId };
