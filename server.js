import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const DiscordWebhook = process.env.DISCORD_WEBHOOK;
const SharedSecret = process.env.SHARED_SECRET || "my-server-secret";

app.post("/forward", async (req, res) => {
  const { content, secret } = req.body || {};
  if (secret !== SharedSecret) return res.status(401).json({ ok: false });
  if (!content || typeof content !== "string") return res.status(400).json({ ok: false });
  try {
    const DiscordRes = await axios.post(DiscordWebhook, { content }, {
      headers: { "Content-Type": "application/json" }
    });
    return res.json({ ok: true, status: DiscordRes.status });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

const Port = process.env.PORT || 3000;
app.listen(Port, () => console.log("Forwarder running on port", Port));
