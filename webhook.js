const express = require("express");
const axios = require("axios");
const app = express();
const port = 3006;

const LEAD_CONNECTOR_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/LycT6YkmToR1d41kPkF9/webhook-trigger/349d365a-c873-4e4d-b7db-b002bea10e5d";

app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    const webhookData = req.body;

    console.log("Webhook data received:", webhookData);

    if (webhookData.type === "user.created") {
      const userData = webhookData.data;
      let email = "";
      if (userData.email_addresses && userData.email_addresses.length > 0) {
        email = userData.email_addresses[0].email_address;
      }
      let phone = "";
      if (userData.phone_numbers && userData.phone_numbers.length > 0) {
        phone = userData.phone_numbers[0].phone_number;
      }
      const leadData = {
        firstName: userData.first_name,
        lastName: userData.last_name,
        email_address: email,
        phone_number: phone,
        userId: userData.id,
        createdAt: userData.created_at,
      };

      const response = await axios.post(LEAD_CONNECTOR_WEBHOOK_URL, leadData);

      console.log("Lead Connector response:", response.data);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ received: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Webhook listening at http://localhost:${port}`);
});
