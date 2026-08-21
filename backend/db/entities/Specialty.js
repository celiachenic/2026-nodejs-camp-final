const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "Specialty",
  tableName: "specialties",
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
    coaches: {
      type: "many-to-many",
      target: "Coach",
      inverseSide: "specialties",
    },
  },
});
