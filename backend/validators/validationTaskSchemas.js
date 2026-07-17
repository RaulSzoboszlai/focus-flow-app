export const createTaskSchema = {
  title: {
    trim: true,
    notEmpty: {
      errorMessage: "Task title is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Task text must be at least 3 characters long",
    },
  },
  category: {
    optional: true,
    trim: true,
    isIn: {
      options: [["Personal", "Work", "Health", "Learning"]],
      errorMessage: "Category must be one of: Personal, Work, Health, Learning",
    },
  },
  time: {
    optional: true,
    trim: true,
  },
  linkedGoalId: {
    optional: { options: { nullable: true, checkFalsy: true } },
    isMongoId: {
      errorMessage: "Invalid Goal ID format. Must be a valid MongoDB ObjectId",
    },
  },
  goalContribution: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "Goal contribution must be an integer of at least 1",
    },
  },
};
