const cron = require("node-cron");
const Booking = require("../models/Booking");

// Every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    const result = await Booking.updateMany(
      {
        status: "pending",
        expiresAt: {
          $lt: new Date(),
        },
      },
      {
        $set: {
          status: "expired",
        },
      },
    );

    if (result.modifiedCount > 0) {
      console.log(`Expired bookings updated: ${result.modifiedCount}`);
    }
  } catch (err) {
    console.error("BOOKING EXPIRY CRON ERROR:", err.message);
  }
});
