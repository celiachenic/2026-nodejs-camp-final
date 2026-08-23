const AppDataSource = require("../db/dataSource");
const app = require("../app");

const start = async () => {
  try {
    await AppDataSource.initialize();
    console.log("資料庫連線成功");
    app.listen(process.env.PORT || 8080, () => {
      console.log("伺服器運作中");
    });
  } catch (error) {
    console.error("資料庫連線失敗", error);
    process.exit(1);
  }
};

start();