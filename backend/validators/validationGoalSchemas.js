export const createGoalSchema = {
  title: {
    notEmpty: {
      errorMessage: "Goal title is required",
    },
    trim: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "Goal title should be at least 3 characters",
    },
  },
  type: {
    notEmpty: {
      errorMessage: "Goal type is required",
    },
    isIn: {
      options: [["numeric", "time"]],
      errorMessage: "Goal type should be either 'numeric' or 'time'",
    },
    trim: true,
  },
  target: {
    isInt: {
      options: { min: 1 },
      errorMessage: "Goal target should be at least 1",
    },
    trim: true,
  },
  unit: {
    optional: true,
    trim: true,
  },
};
