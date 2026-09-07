const appDataSource = require("../db/dataSource");
const purchaseSchema = require("../db/entities/Purchase");
const bookingSchema = require("../db/entities/Booking");
const { IsNull } = require("typeorm");

const getUserCredits = async (userId) => {
  const purchaseRepo = appDataSource.getRepository(purchaseSchema);
  const bookingRepo = appDataSource.getRepository(bookingSchema);

  const [purchases, activeBookingCounts] = await Promise.all([
    purchaseRepo.find({
      where: { user: { id: userId } },
    }),
    bookingRepo.count({
      where: { user: { id: userId }, cancelled_at: IsNull() },
    }),
  ]);

  let credits = 0;
  for (const purchase of purchases) {
    credits += purchase.purchased_credits;
  }

  return {
    creditRemain: credits - activeBookingCounts,
    creditUsage: activeBookingCounts,
  };
};

module.exports = getUserCredits;
