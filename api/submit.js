export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, contact, massage, wishes } = req.body;

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const text = [
    '📋 <b>Нова заявка на масаж</b>',
    '',
    `👤 <b>Ім'я:</b> ${name || '—'}`,
    `📞 <b>Телефон:</b> ${phone || '—'}`,
    `💬 <b>Зв'язок:</b> ${contact || '—'}`,
    `💆 <b>Вид масажу:</b> ${massage || '—'}`,
    `📝 <b>Побажання:</b> ${wishes || '—'}`,
  ].join('\n');

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: 'HTML',
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      return res.status(500).json({ error: data.description });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
