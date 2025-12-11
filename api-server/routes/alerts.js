const express = require("express");
const Alert = require("../models/Alert");
console.log("Alert Model:", Alert);

const router = express.Router();
// console.log("Alert Model:", Alert);

const auth = require("../middleware/auth");




// Get all alerts
router.get("/", auth, async (req, res) => {
    const alerts = await Alert.find().sort({ timestamp: -1 });
    res.json(alerts);
});

module.exports = router;
