'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStrapiMediaUrl } from '@/lib/strapi/media'
import { 
  FolderPlus, 
  Trash2, 
  Upload, 
  Link as LinkIcon, 
  FileImage, 
  Save, 
  X, 
  Loader2,
  FolderOpen,
  Image as ImageIcon
} from 'lucide-react'

interface Category {
  id: number
  documentId?: string
  name: string
  slug: string
  description: string
  image?: {
    id: number
    url: string
  } | null
}

interface CategoriesClientProps {
  initialCategories: Category[]
  jwt: string
}

export default function CategoriesClient({ initialCategories, jwt }: CategoriesClientProps) {
  const router = useRouter()
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
  
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  
  // Form fields
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageId, setImageId] = useState<number | null>(null)
  
  // UI states
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat)
    setIsEditing(true)
    setErrorMsg('')
    setSuccessMsg('')
    
    setName(cat.name)
    setSlug(cat.slug)
    setDescription(cat.description || '')
    setImageUrl(cat.image?.url || '')
    setImageId(cat.image?.id || null)
    setImageFile(null)
  }

  const handleStartCreate = () => {
    setSelectedCategory(null)
    setIsEditing(true)
    setErrorMsg('')
    setSuccessMsg('')
    
    setName('')
    setSlug('')
    setDescription('')
    setImageUrl('')
    setImageId(null)
    setImageFile(null)
  }

  const handleNameChange = (val: string) => {
    setName(val)
    // Auto-generate slug
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    setSlug(generated)
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setUploadingImage(true)
    setErrorMsg('')

    try {
      const formData = new FormData()
      formData.append('files', file)

      const res = await fetch(`${strapiUrl}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error('Image upload failed')

      const data = await res.json()
      if (data && data[0]) {
        setImageId(data[0].id)
        setImageUrl(data[0].url)
        setSuccessMsg('Image uploaded successfully.')
      }
    } catch (err: any) {
      setErrorMsg('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      // Build request body
      const payload: any = {
        name,
        slug,
        description,
      }

      // Handle image reference linking
      // If we uploaded a local file and got an id, link it
      if (imageId) {
        payload.image = imageId
      } else if (imageUrl) {
        // If they set a text URL, we can save it as text if the schema allows, 
        // but since `image` is a media relation, we either link by ID, or we keep it null.
        // If imageId is null but imageUrl exists and is NOT a relative Strapi URL (meaning it's external),
        // we might not be able to save it in standard Media unless we download and re-upload it.
        // For standard Strapi media relation: if they cleared it, set to null.
        payload.image = null
      } else {
        payload.image = null
      }

      // Check if we are editing or creating
      const isNew = selectedCategory === null
      
      // In Strapi v5, routes use documentId, but fallback to numeric ID if configured or documentId is returned.
      // Let's use the appropriate ID. We'll fallback to `id` if `documentId` is missing.
      const identifier = selectedCategory?.documentId || selectedCategory?.id
      const endpoint = isNew 
        ? `${strapiUrl}/api/categories`
        : `${strapiUrl}/api/categories/${identifier}`

      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ data: payload }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error?.message || 'Failed to save category')
      }

      const savedCategory = responseData.data

      // Refresh list
      const updatedRes = await fetch(`${strapiUrl}/api/categories?populate=image`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      const updatedData = await updatedRes.json()
      
      const newCategoriesList = updatedData?.data || []
      setCategories(newCategoriesList)

      setSuccessMsg(isNew ? 'Category created successfully!' : 'Category updated successfully!')
      
      // Select the saved category
      if (isNew) {
        setSelectedCategory(savedCategory)
      } else {
        // Re-align selected category structure
        const reSelected = newCategoriesList.find((c: any) => c.id === savedCategory.id)
        if (reSelected) setSelectedCategory(reSelected)
      }

      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) return
    
    if (!confirm(`Are you sure you want to delete "${selectedCategory.name}"? This will not delete the associated products, but they will no longer be categorized under this.`)) {
      return
    }

    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const identifier = selectedCategory.documentId || selectedCategory.id
      const res = await fetch(`${strapiUrl}/api/categories/${identifier}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })

      if (!res.ok) {
        const responseData = await res.json()
        throw new Error(responseData.error?.message || 'Failed to delete category')
      }

      // Refresh list
      const updatedRes = await fetch(`${strapiUrl}/api/categories?populate=image`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      const updatedData = await updatedRes.json()
      const newCategoriesList = updatedData?.data || []
      
      setCategories(newCategoriesList)
      setSelectedCategory(null)
      setIsEditing(false)
      setSuccessMsg('Category deleted successfully.')
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Error deleting category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl text-on-surface tracking-wide font-medium">Categories</h1>
          <p className="text-on-surface/50 text-sm mt-1">Organize products into distinct collections.</p>
        </div>
        <button
          onClick={handleStartCreate}
          className="flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-950/40 border border-green-500/30 rounded-xl text-green-300 text-sm">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories List */}
        <div className="bg-surface-base border border-surface-container/60 rounded-2xl p-6 h-fit space-y-4">
          <h2 className="text-base font-serif text-on-surface tracking-wide border-b border-surface-container/60 pb-3 flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-primary" />
            <span>All Categories ({categories.length})</span>
          </h2>
          
          {categories.length === 0 ? (
            <div className="text-center py-12 text-on-surface/30">
              No categories found. Click "New Category" to get started.
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory?.id === cat.id
                const catImgUrl = cat.image?.url ? getStrapiMediaUrl(cat.image.url) : null
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-surface-dim/40 border-surface-container hover:bg-surface-container/30 hover:border-surface-container'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex-shrink-0 overflow-hidden border border-surface-high flex items-center justify-center">
                      {catImgUrl ? (
                        <img src={catImgUrl} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-on-surface/30" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold truncate">{cat.name}</h4>
                      <p className="text-xs text-on-surface/40 truncate">{cat.slug}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Editor Form */}
        <div className="lg:col-span-2 bg-surface-base border border-surface-container/60 rounded-2xl p-6">
          {!isEditing ? (
            <div className="h-96 flex flex-col items-center justify-center text-center text-on-surface/40 border border-dashed border-surface-container/80 rounded-xl">
              <FolderOpen className="w-12 h-12 mb-3 text-on-surface/20" />
              <p className="text-sm font-medium">Select a category to edit or create a new one.</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex justify-between items-center border-b border-surface-container/60 pb-3">
                <h3 className="font-serif text-lg font-medium text-on-surface">
                  {selectedCategory ? `Edit: ${selectedCategory.name}` : 'New Category'}
                </h3>
                {selectedCategory && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-900/30 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-xs font-medium transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Category</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface/60 uppercase tracking-wider mb-2">Category Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fine Jewelry"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface-dim/80 border border-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface/60 uppercase tracking-wider mb-2">Web Link Identifier</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. fine-jewelry"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface-dim/80 border border-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface/60 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      rows={4}
                      placeholder="Describe this collection..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface-dim/80 border border-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Image Field */}
                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-on-surface/60 uppercase tracking-wider mb-1">Category Image</label>
                  
                  {/* Image Preview Card */}
                  <div className="aspect-[4/3] rounded-xl border border-surface-container bg-surface-dim/50 flex flex-col items-center justify-center overflow-hidden relative group">
                    {imageUrl ? (
                      <>
                        <img 
                          src={imageUrl.startsWith('http') ? imageUrl : `${strapiUrl}${imageUrl}`} 
                          alt="Category preview" 
                          className="w-full h-full object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl('')
                            setImageId(null)
                            setImageFile(null)
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-on-surface/80 hover:text-white hover:bg-black/90 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-6 text-on-surface/40 flex flex-col items-center">
                        <ImageIcon className="w-12 h-12 text-on-surface/15 mb-2" />
                        <span className="text-xs">No image selected</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="grid grid-cols-1 gap-3">
                    {/* File Upload */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="image-file"
                        onChange={handleImageFileChange}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-file"
                        className={`w-full flex items-center justify-center gap-2 border border-dashed border-surface-container rounded-xl py-2.5 px-4 text-xs font-semibold text-on-surface hover:border-primary/30 hover:bg-surface-container/20 cursor-pointer transition-all ${
                          uploadingImage ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span>Uploading to Strapi...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-primary" />
                            <span>Upload Local Image File</span>
                          </>
                        )}
                      </label>
                    </div>

                    {/* Text URL Option */}
                    <div>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/40" />
                        <input
                          type="text"
                          placeholder="Or paste direct image URL (https://...)"
                          value={imageUrl.startsWith('/') ? '' : imageUrl}
                          onChange={(e) => {
                            setImageUrl(e.target.value)
                            setImageId(null) // clear linked ID since we are pasting a URL
                          }}
                          className="w-full pl-9 pr-4 py-2 bg-surface-dim/80 border border-surface-container rounded-xl text-xs text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 border-t border-surface-container/60 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl border border-surface-container hover:bg-surface-container/30 text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-semibold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
