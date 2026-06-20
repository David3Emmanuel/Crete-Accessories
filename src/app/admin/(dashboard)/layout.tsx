import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import AdminSidebar from './AdminSidebar'

async function checkAdminAuth() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  if (!jwt) {
    return { shouldRedirect: true }
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      return { shouldRedirect: true }
    }

    const user = await res.json()
    if (user.role !== 'admin') {
      return { shouldRedirect: true }
    }

    return { user, jwt, shouldRedirect: false }
  } catch (error) {
    console.error('Error verifying admin auth:', error)
    return { shouldRedirect: true }
  }
}

export default async function DashboardLayout({
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
    </div>
  )
}
