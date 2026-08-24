const appDataSource = require("./dataSource");
const bcrypt = require("bcrypt");
const SEED_USER_PASSWORD = process.env.SEED_USER_PASSWORD;

const PackageSchema = require("../db/entities/Package");
const UserSchema = require("../db/entities/User");
const SkillSchema = require("../db/entities/Skill");
const CoachSchema = require("../db/entities/Coach");
const CourseSchema = require("../db/entities/Course");
const PurchaseSchema = require("../db/entities/Purchase");
const BookingSchema = require("../db/entities/Booking");

const clearAll = async () => {
  const deleteOrder = [
    BookingSchema,
    PurchaseSchema,
    CourseSchema,
    CoachSchema,
    UserSchema,
    SkillSchema,
    PackageSchema,
  ];
  for (const entity of deleteOrder) {
    await appDataSource.createQueryBuilder().delete().from(entity).execute();
  }
};

const seedData = async () => {
  const packageRepo = appDataSource.getRepository(PackageSchema);
  const skillRepo = appDataSource.getRepository(SkillSchema);
  const userRepo = appDataSource.getRepository(UserSchema);
  const coachRepo = appDataSource.getRepository(CoachSchema);
  const courseRepo = appDataSource.getRepository(CourseSchema);
  const purchaseRepo = appDataSource.getRepository(PurchaseSchema);
  const bookingRepo = appDataSource.getRepository(BookingSchema);

  const [package1, package2, package3] = await packageRepo.save([
    { name: "7 堂組合包方案", price: 1400, credit_amount: 7 },
    { name: "14 堂組合包方案", price: 2520, credit_amount: 14 },
    { name: "21 堂組合包方案", price: 4800, credit_amount: 21 },
  ]);

  const [yoga, strength, recovery] = await skillRepo.save([
    { name: "瑜珈" },
    { name: "重訓" },
    { name: "復健訓練" },
  ]);

  const hashed_password = await bcrypt.hash(SEED_USER_PASSWORD,10);
  const [user1, user2, user3] = await userRepo.save([
    { name: "李燕容", email: "123@gamil.com", hashed_password, role: "USER" },
    { name: "黃高高", email: "456@gamil.com", hashed_password, role: "USER" },
    { name: "陳小明", email: "789@gamil.com", hashed_password, role: "USER" },
  ]);
};

const main = async () => {
  try {
    await appDataSource.initialize();
    await clearAll();
    await seedData();
    console.log("seed 完成");
  } finally {
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
    }
  }
};

main().catch((error) => {
  console.error("seed 失敗：", error);
  process.exitCode = 1;
});
