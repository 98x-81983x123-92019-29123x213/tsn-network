module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  let body = '';
  try {
    await new Promise((resolve, reject) => {
      req.on('data', chunk => (body += chunk));
      req.on('end', resolve);
      req.on('error', reject);
    });
    const { key } = JSON.parse(body || '{}');
    const expected = process.env.KEY || 'TSN.accessNetwork';

    if (key === expected) return res.status(200).json({ ok: true });
    return res.status(401).json({ ok: false, message: 'Invalid key' });
  } catch {
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
};
