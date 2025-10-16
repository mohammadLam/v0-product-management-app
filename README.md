# Product Management System

A modern, full-stack product management application built with Next.js, Redux Toolkit, and Tailwind CSS.

## Features

- **Authentication**: JWT-based authentication with email login
- **Product CRUD**: Complete Create, Read, Update, Delete operations
- **Real-time Search**: Debounced search by product name
- **Category Filtering**: Filter products by category
- **Pagination**: Navigate through product pages
- **Form Validation**: Comprehensive client-side validation
- **Responsive Design**: Mobile-first, fully responsive UI
- **Loading States**: Smooth loading indicators for all async operations
- **Error Handling**: User-friendly error messages
- **Delete Confirmation**: Modal confirmation before deletion

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd product-management-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Login

Use the email from your job application to sign in. The app will authenticate with the API and store your JWT token.

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                    # Login page
│   ├── products/
│   │   ├── page.tsx                # Products list
│   │   ├── create/page.tsx         # Create product
│   │   └── [id]/
│   │       ├── page.tsx            # Product details
│   │       └── edit/page.tsx       # Edit product
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── product-form.tsx            # Reusable product form
│   ├── delete-confirm-dialog.tsx   # Delete confirmation modal
│   └── ui/                         # UI components
├── lib/
│   ├── store.ts                    # Redux store configuration
│   ├── hooks.ts                    # Typed Redux hooks
│   ├── store-provider.tsx          # Redux provider
│   └── features/
│       ├── auth/authSlice.ts       # Auth state management
│       └── products/productsSlice.ts # Products state management
└── README.md
\`\`\`

## API Integration

The app integrates with the interview API:

- **Base URL**: `https://interview-api.vercel.app/api`
- **Authentication**: `POST /auth` with email
- **Products**: Full CRUD operations at `/products`

All API requests include the JWT token in the Authorization header.

## Validation Rules

### Product Form Validation

- **Name**: Required, minimum 3 characters
- **Description**: Required, minimum 10 characters
- **Price**: Required, must be a number > 0 and < 1,000,000
- **Stock**: Required, must be a non-negative integer
- **Category**: Required, must select from predefined categories
- **Image URL**: Optional, must be a valid URL if provided

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Visit [vercel.com](https://vercel.com) and sign in

3. Click "New Project" and import your repository

4. Configure your project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Click "Deploy"

Your app will be live at `https://your-project.vercel.app`

### Deploy to Netlify

1. Push your code to GitHub

2. Visit [netlify.com](https://netlify.com) and sign in

3. Click "Add new site" → "Import an existing project"

4. Connect to your GitHub repository

5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

6. Click "Deploy site"

## Features Implemented

### Core Requirements

- ✅ JWT Authentication with email
- ✅ Logout functionality
- ✅ Products list with pagination
- ✅ Real-time search by product name
- ✅ Delete with confirmation dialog
- ✅ Cache management with Redux
- ✅ Create/Edit product forms
- ✅ Category selection and filtering
- ✅ Comprehensive client-side validation
- ✅ Product details page
- ✅ Edit and Delete actions from details page

### UX/UI Features

- ✅ Modern, dark-themed design
- ✅ Responsive layout (mobile & desktop)
- ✅ Loading states for all async operations
- ✅ Error handling with user-friendly messages
- ✅ Smooth transitions and interactions
- ✅ Inline validation messages
- ✅ Empty states with helpful CTAs
- ✅ Consistent spacing and typography
- ✅ Accessible form labels and ARIA attributes

### Bonus Features

- ✅ Category filtering
- ✅ Stock level indicators (color-coded)
- ✅ Formatted currency display
- ✅ Date formatting for created/updated timestamps
- ✅ Product ID display
- ✅ Debounced search (500ms delay)
- ✅ Navigation breadcrumbs
- ✅ Keyboard-accessible forms

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Modular component structure
- Redux Toolkit for predictable state management
- Async thunks for API calls
- Proper error boundaries

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contact

For questions or issues, please open an issue on GitHub.
