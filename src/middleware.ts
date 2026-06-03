import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: any[]) {
            try {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              )
              supabaseResponse = NextResponse.next({ request })
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              )
            } catch (error) {
              // Ignore cookie errors
            }
          },
        },
      }
    )

    // ইউজারের ডাটা ফেচ করা হচ্ছে
    const { data: { user } } = await supabase.auth.getUser()

    // বর্তমান ইউআরএল পাথ (যেমন: /dashboard বা /login)
    const currentPath = request.nextUrl.pathname

    // ১. যদি ইউজার লগিন করা না থাকে এবং ড্যাশবোর্ডে ঢোকার চেষ্টা করে
    if (!user && currentPath.startsWith('/dashboard')) {
      const url = request.nextUrl.clone()
      // আপনার লগিন পেজের লিংক যদি /auth/login হয়, তবে নিচে সেটি দিন
      url.pathname = '/' 
      return NextResponse.redirect(url)
    }

    // ২. যদি ইউজার লগিন করা থাকে এবং আবার লগিন বা সাইনআপ পেজে যাওয়ার চেষ্টা করে
    if (user && (currentPath === '/' || currentPath.startsWith('/auth'))) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    // If middleware fails, still return a valid response
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
