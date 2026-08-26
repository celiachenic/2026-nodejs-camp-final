const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "Course",
  tableName: "courses",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    name: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    description: {
      type: "text",
      nullable: false,
    },
    max_participants: {
      type: "integer",
      nullable: false,
    },
    start_at: {
      type: "timestamptz",
      nullable: false,
    },
    end_at: { type: "timestamptz", nullable: false },
    meeting_url: {
      type: "varchar",
      length: 250,
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
    coach: {
      type: "many-to-one",
      target: "Coach",
      joinColumn: {
        name: "coach_id",
      },
      nullable: false,
    },
    skill: {
      type: "many-to-one",
      target: "Skill",
      joinColumn: {
        name: "skill_id",
      },
      nullable: false,
    },
    bookings: {
      type: "one-to-many",
      target: "Booking",
      inverseSide: "course",
    },
  },
});
