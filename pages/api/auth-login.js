export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body
  const correctPassword = process.env.APP_PASSWORD || 'shopbuilder2024'

  console.log('Password reçu:', password)
  console.log('Password attendu:', correctPassword)

  if (password === correctPassword) {
    res.setHeader('Set-Cookie', `sb_auth=${correctPassword}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`)
    return res.status(200).json({ ok: true })
  }

  return res.status(401).json({ error: 'Incorrect' })
}
