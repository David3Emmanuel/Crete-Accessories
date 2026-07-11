import { Loader2 } from 'lucide-react'

export default function EditProductLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-on-surface/50 font-sans">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="text-xs">Loading product details...</span>
    </div>
  )
}
