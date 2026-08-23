require("dotenv").config();
const { DataSource } = require("typeorm");

const PackageSchema = require("../db/entities/Package");
const UserSchema = require("../db/entities/User");
const SkillSchema = require("../db/entities/Skill");
const CoachSchema = require("../db/entities/Coach");
const CourseSchema = require("../db/entities/Course");
const PurchaseSchema = require("../db/entities/Purchase");
const BookingSchema = require("../db/entities/Booking");

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  poolSize: Number(process.env.DB_POOL_SIZE) || 5,
  entities: [
    PackageSchema,
    UserSchema,
    SkillSchema,
    CoachSchema,
    CourseSchema,
    PurchaseSchema,
    BookingSchema,
  ],
  // 其他連線設定
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  migrations: ["./db/migrations/*.js"],
});

module.exports = AppDataSource;
