module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  globals: {
    AOS: "readonly",
    Swal: "readonly",
    Typed: "readonly",
    emailjs: "readonly",
  },
  rules: {
    "no-unused-vars": "off",
    "no-undef": "error",
  },
};
