// Netlify function: adds an email to your Kit form. Keys stay in Netlify env vars.
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };
  let email = "";
  try { email = String(JSON.parse(event.body || "{}").email || "").trim(); } catch (e) {}
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid email" }) };
  }
  const { KIT_API_KEY, KIT_FORM_ID } = process.env;
  if (!KIT_API_KEY || !KIT_FORM_ID) return { statusCode: 500, body: JSON.stringify({ error: "Not configured" }) };
  const res = await fetch(`https://api.kit.com/v4/forms/${KIT_FORM_ID}/subscribers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Kit-Api-Key": KIT_API_KEY },
    body: JSON.stringify({ email_address: email }),
  });
  return { statusCode: res.ok ? 200 : 502, body: JSON.stringify({ ok: res.ok }) };
};
