const express = require("express");
const router = express.Router();

const {
  getOwnerTenants,
  removeTenant
} = require("../controllers/ownerController");

const {
  protect,
  isOwner
} = require("../middleware/authMiddleware");

router.get(
  "/tenants",
  protect,
  isOwner,
  getOwnerTenants
);

router.delete(
  "/tenants/:bookingId",
  protect,
  isOwner,
  removeTenant
);

module.exports = router;