const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "Coach",
  tableName: "coaches",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    experience_years: {
      type: "integer",
      nullable: false,
    },
    description: {
      type: "text",
      nullable: false,
    },
    profile_image_url: {
      type: "varchar",
      length: 300,
      nullable: true,
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
    user: {
      type: "one-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
      },
      nullable: false,
    },
    courses: {
      type: "one-to-many",
      target: "Course",
      inverseSide: "coach",
    },
    specialties: {
      type: "many-to-many",
      target: "Specialty",
      joinTable: {
        name: "coach_specialties",
        joinColumn: {
          name: "coach_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "specialty_id",
          referencedColumnName: "id",
        },
      },
      inverseSide: "coaches",
    },
  },
});
