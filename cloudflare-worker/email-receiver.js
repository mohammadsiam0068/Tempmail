import { PostalMime } from 'postal-mime'

/**
 * Cloudflare Email Worker
 * Receives emails and stores them in Supabase
 * 
 * Environment variables:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

export default {
  async email(message, env, ctx) {
    try {
      const to = message.to
      const from = message.from
      
      // Parse the raw email
      const rawEmail = await message.raw.text()
      
      // Use postal-mime for proper parsing
      let subject = '(No Subject)'
      let body = ''
      let htmlBody = null
      
      try {
        const email = await PostalMime.parse(rawEmail)
        subject = email.subject || '(No Subject)'
        body = email.text || ''
        htmlBody = email.html || null
      } catch (parseError) {
        console.log('PostalMime parse failed, using fallback:', parseError)
        
        // Fallback parsing
        const subjectMatch = rawEmail.match(/^Subject: (.+?)(\r\n|$)/m)
        subject = subjectMatch ? subjectMatch[1].trim() : '(No Subject)'
        
        const bodyMatch = rawEmail.match(/\r\n\r\n([\s\S]*)/m)
        body = bodyMatch ? bodyMatch[1].substring(0, 10000) : ''
      }

      // Insert into Supabase
      const insertRes = await fetch(
        `${env.SUPABASE_URL}/rest/v1/emails`,
        {
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
            subject: subject.substring(0, 255),
            body: body.substring(0, 50000),
            html_body: htmlBody ? htmlBody.substring(0, 50000) : null,
            received_at: new Date().toISOString(),
          }),
        }
      )

      if (!insertRes.ok) {
        const errorText = await insertRes.text()
        console.error(
          `Supabase error [${insertRes.status}]:`,
          errorText
        )
        
        // Still return success to Cloudflare (don't bounce the email)
        return new Response('OK', { status: 200 })
      }

      console.log(`Email received: ${from} → ${to}`)
      return new Response('OK', { status: 200 })
      
    } catch (error) {
      console.error('Worker error:', error.message)
      return new Response('Error processing email', { status: 500 })
    }
  },
}