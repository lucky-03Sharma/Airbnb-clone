const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
  console.log("✅ /signup route hit");
  res.render("users/signup.ejs");
});

module.exports = router;
