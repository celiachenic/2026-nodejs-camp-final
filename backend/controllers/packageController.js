const appDataSource = require("../db/dataSource");
const packageSchema = require("../db/entities/Package");
const createError = require("../utils/createError");

const getPackage = async (req, res, next) => {
  try {
    const packageRepo = appDataSource.getRepository(packageSchema);
    const packageArray = [];
    const packages = await packageRepo.find();
    for (const package of packages) {
      packageArray.push({
        id: package.id,
        name: package.name,
        credit_amount: package.credit_amount,
        price: package.price,
      });
    }
    return res.status(200).json({
      status: "success",
      data: packageArray,
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, "方案取得失敗"));
  }
};


module.exports = { getPackage };
