export const metadata = {
  title: 'Crete Accessories | Admin Panel',
  description: 'Control center for managing inventory, categories, and orders.',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-surface-dim text-on-surface">
      {children}
    </div>
  )
}
