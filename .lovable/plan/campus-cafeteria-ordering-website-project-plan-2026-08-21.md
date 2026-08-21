# Campus Cafeteria Ordering Website — Project Plan

## Project identity

- College: **Richfield**
- Cafeteria brand: **LunchLinx**
- Visual direction: **Red and blue** college/cafeteria branding, clean card-based layout, rounded corners, friendly food-service aesthetic.

## What we are building

A standalone, plain HTML/CSS/JS website called **LunchLinx** that lets Richfield students and lecturers browse the campus cafeteria menu, create an account, place an order, and track order status. The site is intentionally built without a framework so it can run by simply opening the HTML files in a browser.

The existing AI Workplace Productivity Assistant app will remain untouched; LunchLinx will live in its own folder and be developed as a separate static site.

## Proposal deliverable (1–2 pages)

Produce a formatted proposal document covering exactly the three points the guidelines require:

1. **Purpose of the project**  
   Explain the problem: long queues and limited break times make it hard for Richfield students and lecturers to buy food conveniently. LunchLinx solves this by letting users order ahead from their campus cafeteria, saving time and reducing congestion.

2. **Implementation language**  
   Plain HTML5, CSS3, and vanilla JavaScript. No external frameworks or build tools are required, which keeps the project lightweight and easy to demonstrate.

3. **SDLC model chosen**  
   Waterfall. Requirements, design, implementation, testing, and deployment will follow clear sequential phases with sign-off before moving to the next phase. This matches the academic project timeline and the structured documentation the guidelines expect.

## Website scope and pages

| Page | Purpose |
| --- | --- |
| `index.html` | Landing page with cafeteria name, value proposition, and links to menu, login, and order tracking. |
| `menu.html` | Browse menu categories (meals, snacks, drinks), view prices and descriptions, add items to cart. |
| `login.html` | Simple registration/login form distinguishing students and lecturers. |
| `order.html` | Review cart, choose pickup time, confirm order, and see order summary. |
| `track.html` | Enter an order number to view status: Received, Preparing, Ready for Pickup, Completed. |

## Core features to implement

- Browse menu with categories and prices.
- Add/remove items from a cart.
- User account form (name, email, role: Student or Lecturer).
- Order placement with pickup-time selection.
- Order status tracking using a demo order number.
- Responsive design for mobile, tablet, and desktop.

## Technical approach

- **No build step**: plain `.html`, `.css`, and `.js` files.
- **State**: browser `localStorage` for demo cart, user session, and a few sample orders so the site feels interactive without a backend.
- **Styling**: a single `styles.css` file using CSS variables for the red/blue brand colors, plus a mobile-first responsive layout.
- **Icons**: lightweight inline SVGs or a small icon font; no heavy dependencies.
- **No database or server** for this proposal/prototype phase, consistent with the plain HTML/CSS/JS stack.

## Deliverables for this plan

1. **Proposal document** (`/mnt/documents/LunchLinx_Proposal.docx` or `.pdf`) — 1–2 pages, ready for submission.
2. **LunchLinx static website** in a `cafeteria/` folder containing all HTML/CSS/JS files, runnable locally without installation.

## Out of scope (future enhancements)

- Online payment integration.
- Real backend/database.
- Admin dashboard for cafeteria staff.
- Email/SMS notifications.

These can be added in later SDLC phases or future semesters.
