'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Sparkles, ChevronRight, ChevronLeft, X, Check } from 'lucide-react'

interface TourStep {
  title: string
  text: string
  target: string | null
  path: string
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

export default function AdminTour() {
  const router = useRouter()
  const pathname = usePathname()

  const [step, setStep] = useState<number>(-1)
  const [coords, setCoords] = useState<{
    top: number
    left: number
    width: number
    height: number
    visible: boolean
  }>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    visible: false
  })

  // Define the guided steps
  const steps: TourStep[] = [
    {
      title: 'Welcome to Crete Admin!',
      text: 'This guided tour will show you how to manage your luxury storefront. We will walk through setting up collections, listing products, and processing sales checkouts.',
      target: null,
      path: '/admin',
      position: 'center'
    },
    {
      title: 'Real-time Analytics Dashboard',
      text: 'This overview displays your sales revenue, total checkouts, active items, and stock warning counts in real-time.',
      target: '[data-tour="overview-stats"]',
      path: '/admin',
      position: 'bottom'
    },
    {
      title: 'Categories & Organization',
      text: 'First, you should organize your store. Click "Categories" in the sidebar to create product collections (like Marble Urns or Stone Coasters). We can also navigate there automatically for you by clicking Next.',
      target: '[data-tour="sidebar-categories"]',
      path: '/admin',
      position: 'right'
    },
    {
      title: 'Manage Collections',
      text: 'This page shows your categories. Click "New Category" to group products. Organizing items by collection makes storefront browsing much simpler for customers.',
      target: '[data-tour="add-category-btn"]',
      path: '/admin/categories',
      position: 'bottom'
    },
    {
      title: 'Store Inventory database',
      text: 'Now let\'s check products. Click "Products" in the sidebar or click Next to navigate to your storefront listings database.',
      target: '[data-tour="sidebar-products"]',
      path: '/admin/categories',
      position: 'right'
    },
    {
      title: 'Publishing Products',
      text: 'Here is your current shop inventory. Clicking the "Add Product" button opens the form where you can list a new piece live on your storefront.',
      target: '[data-tour="add-product-btn"]',
      path: '/admin/products',
      position: 'bottom'
    },
    {
      title: 'Identify your Accessory',
      text: 'Let\'s see how the form works. Enter the name here (e.g. "Grecian Urn"). A clean URL slug will automatically be generated for SEO.',
      target: '[data-tour="product-form-name"]',
      path: '/admin/products/new',
      position: 'bottom'
    },
    {
      title: 'Assign Collections',
      text: 'Select the category for your product. This places it under the correct storefront filter tab.',
      target: '[data-tour="product-form-category"]',
      path: '/admin/products/new',
      position: 'bottom'
    },
    {
      title: 'Pricing Details',
      text: 'Input the retail price in NGN (₦). This is the exact amount processed during customer checkout via Paystack.',
      target: '[data-tour="product-form-price"]',
      path: '/admin/products/new',
      position: 'bottom'
    },
    {
      title: 'Fulfillment Count',
      text: 'Set your stock level. When customers buy this item, the count auto-decrements. If it reaches zero, it flags a low stock alert on your dashboard.',
      target: '[data-tour="product-form-stock"]',
      path: '/admin/products/new',
      position: 'bottom'
    },
    {
      title: 'Publish to Storefront',
      text: 'Once details are complete, click "Publish Product" to save the item. Once saved, it will instantly appear live on the storefront for customers to purchase!',
      target: '[data-tour="product-form-save"]',
      path: '/admin/products/new',
      position: 'top'
    },
    {
      title: 'Customer Orders',
      text: 'Finally, click "Orders" in the sidebar or click Next to see customer checkouts.',
      target: '[data-tour="sidebar-orders"]',
      path: '/admin/products/new',
      position: 'right'
    },
    {
      title: 'Processing Sales',
      text: 'All successful storefront checkouts populate here automatically. Select an order to inspect contact info, shipping addresses, and to update delivery status.',
      target: '[data-tour="sidebar-orders"]',
      path: '/admin/orders',
      position: 'right'
    },
    {
      title: 'Tour Complete!',
      text: 'You are ready to manage Crete Accessories. Remember that adding real products here publishes them straight to the storefront. You can restart this tour anytime from the sidebar.',
      target: null,
      path: '/admin/orders',
      position: 'center'
    }
  ]

  // Listen for the custom event to start the tour
  useEffect(() => {
    const handleStartTour = () => {
      setStep(0)
      sessionStorage.setItem('admin_tour_active', 'true')
      sessionStorage.setItem('admin_tour_step', '0')
      router.push('/admin')
    }

    window.addEventListener('start-admin-tour', handleStartTour)
    
    // Resume tour state from storage if active
    const isActive = sessionStorage.getItem('admin_tour_active') === 'true'
    const storedStep = sessionStorage.getItem('admin_tour_step')
    if (isActive && storedStep !== null) {
      setStep(parseInt(storedStep))
    }

    return () => {
      window.removeEventListener('start-admin-tour', handleStartTour)
    }
  }, [router])

  // Track coordinates of target element dynamically
  useEffect(() => {
    if (step === -1 || step >= steps.length) {
      setCoords(prev => ({ ...prev, visible: false }))
      return
    }

    const currentStep = steps[step]
    
    // If the step belongs to another page, wait until routing is done
    if (pathname !== currentStep.path) {
      setCoords(prev => ({ ...prev, visible: false }))
      return
    }

    if (!currentStep.target) {
      setCoords({ top: 0, left: 0, width: 0, height: 0, visible: true })
      return
    }

    let active = true
    const updatePosition = () => {
      if (!active) return
      const el = document.querySelector(currentStep.target!)
      if (el) {
        const rect = el.getBoundingClientRect()
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
          visible: true
        })
      } else {
        setCoords(prev => ({ ...prev, visible: false }))
      }
      requestAnimationFrame(updatePosition)
    }

    requestAnimationFrame(updatePosition)

    return () => {
      active = false
    }
  }, [step, pathname])

  const endTour = () => {
    setStep(-1)
    sessionStorage.removeItem('admin_tour_active')
    sessionStorage.removeItem('admin_tour_step')
  }

  const navigateToStep = (nextIdx: number) => {
    if (nextIdx < 0) return
    if (nextIdx >= steps.length) {
      endTour()
      return
    }

    const nextStep = steps[nextIdx]
    sessionStorage.setItem('admin_tour_step', nextIdx.toString())
    setStep(nextIdx)

    if (pathname !== nextStep.path) {
      router.push(nextStep.path)
    }
  }

  if (step === -1 || step >= steps.length) return null

  const currentStep = steps[step]
  const hasBack = step > 0
  const isLast = step === steps.length - 1

  // Generate positioning style for tooltip bubble
  const getTooltipStyle = () => {
    if (!currentStep.target || !coords.visible) {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 60,
        width: '320px'
      }
    }

    const gap = 12
    const tooltipWidth = 320
    let top = coords.top
    let left = coords.left

    switch (currentStep.position) {
      case 'right':
        top = coords.top + coords.height / 2
        left = coords.left + coords.width + gap
        return {
          position: 'absolute' as const,
          top: `${top}px`,
          left: `${left}px`,
          transform: 'translateY(-50%)',
          zIndex: 60,
          width: `${tooltipWidth}px`
        }
      case 'left':
        top = coords.top + coords.height / 2
        left = coords.left - tooltipWidth - gap
        return {
          position: 'absolute' as const,
          top: `${top}px`,
          left: `${left}px`,
          transform: 'translateY(-50%)',
          zIndex: 60,
          width: `${tooltipWidth}px`
        }
      case 'bottom':
        top = coords.top + coords.height + gap
        left = coords.left + coords.width / 2 - tooltipWidth / 2
        return {
          position: 'absolute' as const,
          top: `${top}px`,
          left: `${left}px`,
          zIndex: 60,
          width: `${tooltipWidth}px`
        }
      case 'top':
        top = coords.top - gap
        left = coords.left + coords.width / 2 - tooltipWidth / 2
        return {
          position: 'absolute' as const,
          top: `${top}px`,
          left: `${left}px`,
          transform: 'translateY(-100%)',
          zIndex: 60,
          width: `${tooltipWidth}px`
        }
      default:
        return {
          position: 'fixed' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 60,
          width: `${tooltipWidth}px`
        }
    }
  }

  return (
    <>
      {/* 1. Backdrop overlay */}
      <div 
        onClick={endTour}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] transition-opacity duration-300"
      />

      {/* 2. Target element glowing highlight border (only shown when target exists and is visible on page) */}
      {currentStep.target && coords.visible && (
        <div 
          className="absolute pointer-events-none rounded-lg border-2 border-primary z-50 transition-all duration-300 shadow-[0_0_15px_rgba(230,195,100,0.4)] animate-pulse"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: `${coords.width}px`,
            height: `${coords.height}px`
          }}
        />
      )}

      {/* 3. Popover Tooltip Box */}
      <div 
        style={getTooltipStyle()}
        className="bg-surface-base border border-surface-container shadow-2xl rounded-2xl p-5 select-none font-sans z-50 text-left"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-primary/10 rounded-lg text-primary text-[10px] uppercase font-bold tracking-wider font-sans">
              Guided Step {step + 1} of {steps.length}
            </span>
          </div>
          <button 
            onClick={endTour}
            className="p-1 hover:bg-surface-container rounded-lg text-on-surface/40 hover:text-on-surface transition-colors cursor-pointer border-0 bg-transparent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h4 className="text-md font-serif text-primary font-bold tracking-wide mb-1.5 leading-snug">
          {currentStep.title}
        </h4>
        <p className="text-xs text-on-surface/70 leading-relaxed font-sans mb-4">
          {currentStep.text}
        </p>

        <div className="flex items-center justify-between border-t border-surface-container/60 pt-3">
          <button 
            onClick={endTour}
            className="text-[10px] text-on-surface/45 hover:text-on-surface hover:underline cursor-pointer border-0 bg-transparent font-medium"
          >
            Skip Tour
          </button>

          <div className="flex gap-2">
            {hasBack && (
              <button
                onClick={() => navigateToStep(step - 1)}
                className="flex items-center gap-1 px-3 py-1.5 bg-surface-container hover:bg-surface-high border border-surface-high hover:border-surface-high/50 text-on-surface text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={() => navigateToStep(step + 1)}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer border-0"
            >
              {isLast ? (
                <>
                  <span>Finish</span>
                  <Check className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
