import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { content, secret } = req.body || {};
  const discordWebhook = process.env.DISCORD_WEBHOOK;
  const sharedSecret = process.env.SHARED_SECRET || "my-server-secret";

  if (secret !== sharedSecret) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  if (!content || typeof content !== "string") {
    return res.status(400).json({ ok: false, error: "Invalid content" });
  }

  try {
    const discordRes = await axios.post(discordWebhook, { content }, {
      headers: { "Content-Type": "application/json" }
    });
    return res.status(200).json({ ok: true, status: discordRes.status });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
