export const registerSchema = {
  email: {
    isEmail: {
      errorMessage: "Please provide a valid email address",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
  displayName: {
    isLength: {
      options: { min: 3 },
      errorMessage: "Display name must be at least 3 characters long",
    },
    notEmpty: {
      errorMessage: "Display name is required",
    },
  },
};

export const loginSchema = {
  email: {
    isEmail: {
      errorMessage: "Please provide a valid email address",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
};
