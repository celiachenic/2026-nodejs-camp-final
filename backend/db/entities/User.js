const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    name: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 200,
      unique: true,
    },
    hashed_password: {
      type: "varchar",
      length: 200,
      nullable: false,
    },
    role: {
      type: "varchar",
      length: 20,
      default: "USER",
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
      deleteDate: true,
      nullable: true,
    },
  },
  relations: {
    purchases: {
      type: "one-to-many",
      target: "Purchase",
      inverseSide: "user",
    },
    bookings: {
      type: "one-to-many",
      target: "Booking",
      inverseSide: "user",
    },
  },
});
