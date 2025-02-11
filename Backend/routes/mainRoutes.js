const express = require("express");
const router = express.Router();
const userRoutes = require("../routes/userRoutes");
const adminRoutes = require("../routes/adminRoutes");
const formRoutes = require("../routes/formRoutes");
const eventRoutes = require("../routes/eventsRoutes");
const taskRoutes = require("../routes/taskRoutes");
const contactRoutes = require("../routes/contactRoutes");
const requirtingRoutes = require("../routes/requirtingRoutes");
const certificateRoutes = require("../routes/certificate");
const adminGenrateTicket = require("../routes/adminTicketRoute");
const webadminRoutes = require("../routes/mainWebRoutes");
const recruitmentControllRoutes = require("./recruitmentControllRoutes");
const transactionRoutes = require("../routes/transactionRoutes");

router.use("/users", userRoutes);
router.use("/users/task", taskRoutes);
router.use("/user/certificate", certificateRoutes);
router.use("/admin", adminRoutes);
router.use("/admin/event", eventRoutes);
router.use("/admin/ticket", adminGenrateTicket);
router.use("/admin/contact", contactRoutes);
router.use("/admin/forms", formRoutes);
router.use("/admin/requirment", requirtingRoutes);
router.use("/admin/recruitmentControll", recruitmentControllRoutes);
router.use("/admin/transaction", transactionRoutes);
router.use("/webadmin", webadminRoutes);

module.exports = router;
