const appDataSource = require("../db/dataSource");
const packageSchema = require("../db/entities/Package");
const createError = require("../utils/createError");
const isUuid = require("../utils/isUuid");

const getPackages = async (req, res, next) => {
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

const postPackage = async (req, res, next) => {
  try {
    const { name, price, credit_amount } = req.body;
    //400：任一欄位沒給；name 不是字串或為空；credit_amount 或 price 不是數字、是負數、或帶小數
    if (
      typeof name !== "string" ||
      name.trim() === "" ||
      typeof credit_amount !== "number" ||
      credit_amount < 1 ||
      !Number.isInteger(credit_amount) ||
      typeof price !== "number" ||
      price < 1 ||
      !Number.isInteger(price)
    ) {
      return next(createError(400, "欄位未填寫正確"));
    }
    //409：name 與既有方案重複
    const nameData = name.trim();
    const packageRepo = appDataSource.getRepository(packageSchema);

    if (await packageRepo.findOneBy({ name: nameData })) {
      return next(createError(409, "資料重複"));
    }
    const newPackage = await packageRepo.save({
      name: nameData,
      credit_amount,
      price,
    });

    return res.status(200).json({
      status: "success",
      data: {
        id: newPackage.id,
        name: newPackage.name,
        credit_amount: newPackage.credit_amount,
        price: newPackage.price,
        created_at: newPackage.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, "方案新增失敗"));
  }
};

const deletePackage = async (req, res, next) => {
  try {
    const { creditPackageId } = req.params;
    if (!isUuid(creditPackageId)) {
      return next(createError(400, "格式錯誤"));
    }
    const packageRepo = appDataSource.getRepository(packageSchema);
    const result = await packageRepo.softDelete({ id: creditPackageId });
    if (result.affected !== 1) {
      return next(createError(400, "ID錯誤"));
    }
    return res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, "方案刪除失敗"));
  }
};

module.exports = { getPackages, postPackage, deletePackage };
