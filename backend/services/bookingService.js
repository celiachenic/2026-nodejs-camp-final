const appDataSource = require("../db/dataSource");
const bookingSchema = require("../db/entities/Booking");

const getUserBookings = async (userId) => {
   const bookingRepo = appDataSource.getRepository(bookingSchema);
    const bookings = await bookingRepo.find({
      where: { user: { id: userId }, },
      relations: {
        course: { coach: { user: true } },
      },
      order: { course: { start_at: "ASC" } },
    });

  return bookings
};


module.exports = getUserBookings;
