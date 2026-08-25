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

  // ====================
  // Packages
  const [package1, package2, package3] = await packageRepo.save([
    { name: "7 堂組合包方案", price: 1400, credit_amount: 7 },
    { name: "14 堂組合包方案", price: 2520, credit_amount: 14 },
    { name: "21 堂組合包方案", price: 4800, credit_amount: 21 },
  ]);
  // ====================

  // ====================
  // Skills
  const [yoga, strength, recovery] = await skillRepo.save([
    { name: "瑜珈" },
    { name: "重訓" },
    { name: "復健訓練" },
  ]);
  // ====================

  // ====================
  // users
  const hashed_password = await bcrypt.hash(SEED_USER_PASSWORD, 10);
  const [user1, user2, user3, user4, user5] = await userRepo.save([
    { name: "李燕容", email: "123@gmail.com", hashed_password, role: "COACH" },
    { name: "黃高高", email: "456@gmail.com", hashed_password, role: "COACH" },
    { name: "陳小明", email: "789@gmail.com", hashed_password, role: "USER" },
    { name: "王小花", email: "101@gmail.com", hashed_password, role: "USER" },
    { name: "蔡香香", email: "999@gmail.com", hashed_password, role: "USER" },
  ]);
  // ====================

  // ====================
  //coaches
  const [coach1, coach2] = await coachRepo.save([
    {
      user: user1,
      skills: [yoga, recovery],
      experience_years: 5,
      description:
        "李燕容教練擁有多年重量訓練與體態管理經驗，專注於協助學員建立正確的訓練觀念。課程會依照學員的體能狀況與訓練目標調整內容，從基礎動作到進階訓練循序漸進，幫助學員安全且有效地提升肌力與體能。",
      profile_image_url: "https://example.com/avatar.png",
    },
    {
      user: user2,
      skills: [strength, recovery],
      experience_years: 3,
      description:
        "具備豐富的功能性訓練與運動表現指導經驗，擅長透過多元訓練方式提升學員的肌力、穩定度與活動能力。課程中特別重視動作品質與訓練安全，並依照學員的進步狀況持續調整計畫，協助學員穩定達成各階段的健身目標。",
      profile_image_url: "",
    },
  ]);
  // ====================

  // ====================
  //courses
  const [course1, course2] = await courseRepo.save([
    {
      name: "初級瑜珈班",
      description: "適合瑜珈初學者體驗，學習基礎姿勢與呼吸技巧。",
      max_participants: 20,
      start_at: "2026-08-25T10:00:00Z",
      end_at: "2026-08-25T12:00:00Z",
      meeting_url: "https://meet.example.com/abc-defg-hij",
      coach: coach1,
      skill: yoga,
    },
    {
      name: "新手肌力入門班",
      description: "從基礎動作開始建立正確姿勢與肌力訓練觀念",
      max_participants: 15,
      start_at: "2026-08-28T09:00:00Z",
      end_at: "2026-08-28T11:00:00Z",
      meeting_url: "https://meet.example.com/bcd-efgh-ijk",
      coach: coach2,
      skill: strength,
    },
    {
      name: "中級重訓班",
      description: "學習正確的重訓技巧，強化全身肌群",
      max_participants: 20,
      start_at: "2026-08-27T10:00:00Z",
      end_at: "2026-08-27T12:00:00Z",
      meeting_url: "https://meet.example.com/abc-defg-hij",
      coach: coach2,
      skill: strength,
    },
  ]);
  // ====================

  // ====================
  // purchases
  const [purchase1, purchase2] = await purchaseRepo.save([
    {
      saved_name: "7 堂組合包方案",
      price_paid: 1400,
      purchased_credits: 7,
      purchase_at: "2026-08-15T10:00:00Z",
      package: package1,
      user: user3,
    },
    {
      saved_name: "21 堂組合包方案",
      price_paid: 4800,
      purchased_credits: 21,
      purchase_at: "2026-08-14T10:00:00Z",
      package: package3,
      user: user4,
    },
  ]);
  // ====================

  // ====================
  //bookings
  await bookingRepo.save([
    { created_at: "2026-08-24T10:00:00Z", user: user3, course: course1 },
    { created_at: "2026-08-20T10:00:00Z", user: user4, course: course2 },
  ]);
  // ====================
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
