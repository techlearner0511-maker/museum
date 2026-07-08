import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const STATE_KEY = 'museum-tracker-state';

export default async function handler(req, res) {
  // Optional simple PIN gate. Set MUSEUM_PIN in your Vercel project's
  // Environment Variables to require it; leave unset to disable.
  const requiredPin = process.env.MUSEUM_PIN;
  if (requiredPin) {
    const providedPin = req.headers['x-pin'];
    if (providedPin !== requiredPin) {
      res.status(401).json({ error: 'Invalid PIN' });
      return;
    }
  }

  if (req.method === 'GET') {
    try {
      const data = await redis.get(STATE_KEY);
      res.status(200).json(data || {});
    } catch (e) {
      res.status(500).json({ error: 'Failed to load state' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      await redis.set(STATE_KEY, body);
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save state' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
