# Crete Accessories — Frontend

This is the Next.js 14 frontend application for the Crete Accessories luxury e-commerce platform.

## Getting Started

First, install dependencies:
```bash
pnpm install
```

Second, configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
```

Third, run the development server:
```bash
pnpm dev
```

---

## Google Analytics 4 (GA4) Event Tracking

The project uses `@next/third-parties/google` to integrate GA4. Measurement events are triggered programmatically via both client-side handlers and a declarative helper component for server-rendered page entries.

### Helper Component
* **`TrackEvent`** (`src/components/analytics/TrackEvent.tsx`): Mounts on server-rendered pages (like catalog pages and product detail screens) and automatically fires the designated GA event on client mount.

### Implemented GA4 Events Summary

| Event Name | Trigger Context | Associated Parameters |
| :--- | :--- | :--- |
| **`view_item_list`** | Viewing the homepage (New Arrivals shelf), shop catalog, or category pages. | `item_list_id`, `item_list_name`, `items` (array) |
| **`view_item`** | Loading a product detail page. | `value`, `currency`, `items` (array) |
| **`select_item`** | Clicking on any product grid card to view details. | `items` (array) |
| **`add_to_cart`** | Adding an item to the cart (from product page or product card). | `value`, `currency`, `items` (array with qty) |
| **`view_cart`** | Opening the cart drawer or visiting `/cart`. | `value`, `currency`, `items` (array) |
| **`remove_from_cart`** | Deleting an item or reducing its quantity to 0 in the cart. | `value`, `currency`, `items` (array) |
| **`begin_checkout`** | Navigating to the secure checkout page. | `value`, `currency`, `items` (array) |
| **`purchase`** | Redirect landing on payment success from Paystack. | `transaction_id`, `value`, `currency`, `tax`, `shipping`, `items` |
| **`add_to_wishlist`** | Clicking the "Save" (Heart) button on a product page. | `value`, `currency`, `items` (array) |
| **`login`** | Successful user authentication. | `method` (`email_password`) |
| **`sign_up`** | Successful new account registration. | `method` (`email_password`) |
| **`search`** | Submitting a search query from the header. | `search_term` |

### Parameter Details
* **Currency:** Standardized to `NGN` for Nigerian Naira transaction reporting.
* **Items Array:** Standard e-commerce payloads contain:
  * `item_id`: Unique product ID string.
  * `item_name`: The product name.
  * `price`: Single unit product cost.
  * `quantity`: Selected quantity (defaulting to 1 where applicable).
  * `item_variant`: Selected style, finish, or color.
  * `item_category`: The category (e.g. Jewelry, Books, Caps).

