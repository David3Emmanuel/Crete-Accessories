import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { connection } from 'next/server'
import Link from 'next/link'
import { Suspense } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTour from './AdminTour'

async function checkAdminAuth() {
  await connection()
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  if (!jwt) {
    return { shouldRedirect: true }
  }

  try {
    console.log('[checkAdminAuth] Fetching /api/users/me. JWT exists:', !!jwt);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cache: 'no-store',
      }
    )

    console.log('[checkAdminAuth] Response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.log('[checkAdminAuth] Response not OK. Body:', errorText);
      return { shouldRedirect: true }
    }

    const user = await res.json()
    console.log('[checkAdminAuth] Fetched user data:', user);
    if (user.role !== 'admin') {
      console.log('[checkAdminAuth] Redirecting because role is not admin. Role was:', user.role);
      return { shouldRedirect: true }
    }

    return { user, jwt, shouldRedirect: false }
  } catch (error) {
    console.error('[checkAdminAuth] Exception caught:', error)
    return { shouldRedirect: true }
  }
}

async function AuthWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await checkAdminAuth()

  if (auth.shouldRedirect) {
    redirect('/admin/login')
  }

  const user = auth.user!

  return (
    <div className="flex min-h-screen bg-surface-dim font-sans text-on-surface">
      {/* Sidebar Navigation */}
      <AdminSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-surface-container/60 flex items-center justify-between px-6 bg-surface-base/40 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Left Header Info */}
            <h2 className="text-sm font-medium text-on-surface/50">
              Logged in as <span className="text-primary">{user.username}</span>
            </h2>
          </div>
          <div>
            <Link
              href="/"
              className="text-xs text-on-surface/60 hover:text-primary transition-colors border border-surface-container hover:border-primary/30 rounded-lg px-3 py-1.5"
            >
              Go to Storefront
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
      <AdminTour />
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-surface-dim text-on-surface font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-on-surface/50 font-sans">Verifying session...</p>
        </div>
      </div>
    }>
      <AuthWrapper>{children}</AuthWrapper>
    </Suspense>
  )
}
