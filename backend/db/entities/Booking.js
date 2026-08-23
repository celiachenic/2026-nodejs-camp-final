const { EntitySchema } = require("typeorm");
module.exports = new EntitySchema({
  name: "Booking",
  tableName: "bookings",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    created_at: {
      type: "timestamptz",
      createDate: true,
    },
    cancelled_at: {
      type: "timestamptz",
      nullable: true,
    },
  },

  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
      },
      nullable: false,
    },
    course: {
      type: "many-to-one",
      target: "Course",
      joinColumn: {
        name: "course_id",
      },
      nullable: false,
    },
  },
});
