const express = require("express");
const router = express.Router();
const controller = require("../controllers/addressController");

router.use((req, res, next) => {
  console.log("Request received:", req.method, req.originalUrl);
  next();
});

router.get("/", controller.getAddresses);
router.post("/", controller.addAddress);
router.put("/:id", controller.updateAddress);
router.delete("/:id", controller.deleteAddress);
router.post("/bulk", controller.bulkImport);

module.exports = router;
