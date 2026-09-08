const createError = require("../utils/createError");
const appDataSource = require("../db/dataSource");
const courseSchema = require("../db/entities/Course");
const bookingSchema = require("../db/entities/Booking");
const { LessThanOrEqual, MoreThan, IsNull } = require("typeorm");
const isUuid = require("../utils/isUuid");
const getUserCredits = require("../services/creditService");
const getUserBookings = require("../services/bookingService");

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

const bookCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const user = req.user;

    if (!isUuid(courseId)) {
      return next(createError(400, "ID錯誤"));
    }

    const { creditRemain } = await getUserCredits(user.id);
    const bookings = await getUserBookings(user.id);

    if (creditRemain === 0) {
      return next(createError(400, "已無可使用堂數"));
    }

    const alreadyBooked = bookings.find(
      (booking) => booking.course.id === courseId,
    );
    if (alreadyBooked) {
      return next(createError(400, "已經報名過此課程"));
    }

    const courseRepo = appDataSource.getRepository(courseSchema);
    const bookingRepo = appDataSource.getRepository(bookingSchema);
    const courseCurrentParticipants = await bookingRepo.count({
      where: { course: { id: courseId }, cancelled_at: IsNull() },
    });
    const course = await courseRepo.findOneBy({ id: courseId });
    if (!course) {
      return next(createError(400, "ID錯誤"));
    }
    if (course.max_participants === courseCurrentParticipants) {
      return next(createError(400, "已達最大參加人數，無法參加"));
    }

    const newBooking = await bookingRepo.save({
      user: { id: user.id },
      course: { id: courseId },
    });

    if (!newBooking) {
      return next(createError(500, "報名課程失敗"));
    }

    return res.status(201).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, "報名課程失敗"));
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const user = req.user;
    if (!isUuid(courseId)) {
      return next(createError(400, "ID錯誤"));
    }

    const bookingRepo = appDataSource.getRepository(bookingSchema);
    const booking = await bookingRepo.findOne({
      where: {
        course: { id: courseId },
        user: { id: user.id },
        cancelled_at: IsNull(),
      },
    });
    if (!booking) {
      return next(createError(400, "ID錯誤"));
    }

    booking.cancelled_at = new Date();
    await bookingRepo.save(booking);

    return res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, "取消失敗"));
  }
};
module.exports = { getCourses, bookCourse, cancelBooking };
