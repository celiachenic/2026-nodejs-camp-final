const appDataSource = require("../db/dataSource");

const packageSchema = require("../db/entities/Package");
// 可以手算驗證的範例：系統裡共 2 個方案——「10 堂 1000 元」＋「3 堂 1000 元」→ 單堂均價 = (1000+1000) ÷ (10+3) = 2000 ÷ 13 ≈ 153.846…；該月未取消報名 2 筆 → revenue = floor(2 × 153.846…) = floor(307.69…) = 307。

const getCourseAveragePrice = async () => {
  let packageRepo = appDataSource.getRepository(packageSchema);
  let packages = await packageRepo.findBy();

  let credits = 0;
  let prices = 0;
  packages.map((package) => {
    prices += package.price;
    credits += package.credit_amount;
  });

  return prices / credits;
};
module.exports = { getCourseAveragePrice };
