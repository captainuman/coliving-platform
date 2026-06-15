const express = require("express");
const router = express.Router();

const {
  createProperty,
  getProperties
} = require("../controllers/propertyController");

const {
  protect,
  isOwner
} = require("../middleware/authMiddleware");

// Owner creates property
router.post(
  "/",
  protect,
  isOwner,
  createProperty
);

// Public property listing
router.get(
  "/",
  getProperties
);

module.exports = router;