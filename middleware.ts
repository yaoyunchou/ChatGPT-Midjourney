import { NextRequest, NextResponse } from 'next/server'
import { getIP } from './app/api/auth'

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  // Parse the cookie
    //   const isInBeta = JSON.parse(req.cookies.get('beta')?.value || 'false')
    //   console.log(process.env)
  const ip = getIP(req)
  console.log('[User IP]', ip)
//   console.log(req)
  // Update url pathname
//   req.nextUrl.pathname = `/${isInBeta ? 'beta' : 'non-beta'}`

  // Rewrite to url
//   return NextResponse.rewrite(req.nextUrl)
}