require("dotenv").config();
const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const transactionController = {
  //get transaction logs
  getTransactionLogs: async (req, res) => {
    try {
      const payments = await razorpayInstance.payments.all({
        from: req.query.from,
        to: req.query.to,
        count: req.query.count || 50,
      });

      const formattedPayments = payments.items.map((payment) => ({
        paymentId: payment.id,
        amount: payment.amount / 100,
        status: payment.status,
        email: payment.email,
        contact: payment.contact,
        createdAt: payment.created_at,
        method: payment.method,
        currency: payment.currency,
      }));

      return res.status(200).json({
        success: true,
        transactions: formattedPayments,
      });
    } catch (error) {
      console.error("Error fetching transaction logs:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching transaction logs",
        error: error.message,
      });
    }
  },

  //get full balance
  getBalance: async (req, res) => {
    try {
      const thirtyDaysAgo = Math.floor(
        (Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000
      );
      const currentTime = Math.floor(Date.now() / 1000);

      const settlements = await razorpayInstance.settlements.all({
        from: thirtyDaysAgo,
        to: currentTime,
      });

      const formattedBalance = {
        totalAmount:
          settlements.items.reduce((acc, item) => acc + item.amount, 0) / 100,
        currency: "INR",
        settled:
          settlements.items.reduce(
            (acc, item) =>
              item.status === "processed" ? acc + item.amount : acc,
            0
          ) / 100,
        unsettled:
          settlements.items.reduce(
            (acc, item) =>
              item.status !== "processed" ? acc + item.amount : acc,
            0
          ) / 100,
        lastUpdated: new Date().toISOString(),
      };

      return res.status(200).json({
        success: true,
        balance: formattedBalance,
      });
    } catch (error) {
      console.error("Error fetching balance:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching balance from Razorpay",
        error: error.message,
      });
    }
  },
};

module.exports = transactionController;
