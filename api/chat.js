// Serverless function proxy sang Gemini API — API key nằm ở env GEMINI_API_KEY của Vercel.
// Nhận { body } JSON từ client (toàn bộ payload Gemini) + ?model=, pass-through status.
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ error: { message: 'POST only' } }));
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ error: { message: 'GEMINI_API_KEY not configured' } }));
  }
  const model = String(req.query.model || 'gemini-flash-lite-latest').replace(/[^a-z0-9.\-]/gi, '');
  try {
    const g = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + encodeURIComponent(key),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body || {}),
      }
    );
    const text = await g.text();
    res.statusCode = g.status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(text);
  } catch (err) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ error: { message: String((err && err.message) || err) } }));
  }
};
