const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

// @desc   Get logged-in user's notifications
// @route  GET /api/notifications
// @access Private
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, notifications });
});

// @desc   Mark a notification as read
// @route  PUT /api/notifications/:id/read
// @access Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  notification.isRead = true;
  await notification.save();
  res.json({ success: true, notification });
});

module.exports = { getMyNotifications, markAsRead };
