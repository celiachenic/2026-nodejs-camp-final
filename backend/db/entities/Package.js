const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "Package",
  tableName: "packages",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    name: {
      type: "varchar",
      length: 50,
      unique:true,
      nullable: false,
    },
    price: {
      type: "integer",
      nullable: false,
    },
    credit_amount: {
      type: "integer",
      nullable: false,
    },
    created_at: {
      type: "timestamptz",
      createDate: true,
    },
    updated_at: {
      type: "timestamptz",
      updateDate: true,
    },
    deleted_at: {
      type: "timestamptz",
      deleteDate:true,
      nullable: true,
    },
  },
});
