/**
 * Cloudflare Email Worker
 * Deploy this separately at: Cloudflare Dashboard → Workers & Pages
 *
 * Environment variables needed:
 *   SUPABASE_URL       → your Supabase project URL
 *   SUPABASE_SERVICE_KEY → your Supabase service_role key
 */

export default {
  async email(message, env, ctx) {
    const to = message.to
    const from = message.from

    // Read raw email content
    const rawEmail = await new Response(message.raw).text()

    // Parse subject
    const subjectMatch = rawEmail.match(/^Subject: (.+)$/mi)
    const subject = subjectMatch ? subjectMatch[1].trim() : '(No Subject)'

    // Parse body (simple split on double newline)
    const headerBodySplit = rawEmail.indexOf('\r\n\r\n')
    const rawBody = headerBodySplit !== -1 ? rawEmail.substring(headerBodySplit + 4) : rawEmail
    const body = rawBody.substring(0, 10000)

    // Try to extract HTML part
    let htmlBody = null
    const htmlMatch = rawEmail.match(/Content-Type: text\/html[^\r\n]*\r\n(?:[^\r\n]+\r\n)*\r\n([\s\S]+?)(?:--|\z)/i)
    if (htmlMatch) {
      htmlBody = htmlMatch[1].trim().substring(0, 50000)
    }

    // Insert into Supabase
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        to_address: to,
        from_address: from,
        subject,
        body,
        html_body: htmlBody,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Supabase insert error:', err)
    }
  },
}
