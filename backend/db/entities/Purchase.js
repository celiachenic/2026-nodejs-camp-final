const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "Purchase",
  tableName: "purchases",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    //購買當下的 package 名稱 (避免 package 變更，導致購買歷史紀錄被修改)
    saved_name: {
      type: "varchar",
      nullable: false,
    },
    //購買當下的價格
    saved_price: {
      type: "integer",
      nullable: false,
    },
    //購買當下的堂數
    saved_credits: {
      type: "integer",
      nullable: false,
    },
    created_at: {
      type: "timestamptz",
      createDate: true,
    },
  },
  relations: {
    package: {
      type: "many-to-one",
      target: "Package",
      joinColumn: {
        name: "package_id",
      },
      nullable: false,
    },
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
      },
      nullable: false,
    },
  },
});
