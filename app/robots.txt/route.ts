
import { NextResponse } from 'next/server'

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /login
Disallow: /_next/
Disallow: /static/

Sitemap: https://reprompt.com/sitemap.xml
`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
