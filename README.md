# Élysée Restaurant

A modern, elegant restaurant website built with React, TypeScript, and Tailwind CSS. Features a beautiful menu display, reservation system with local storage, and receipt generation.

## Features

- **Elegant Menu Display** - Beautifully presented menu with categories and detailed dish descriptions
- **Reservation System** - Book tables with date, time, party size, and table type selection
- **Receipt Generation** - View and download individual reservation receipts as PNG images
- **Reservation Management** - View all reservations, cancel confirmed bookings
- **Responsive Design** - Fully responsive layout optimized for all devices
- **Local Storage** - Reservations persist in browser local storage
- **Modern UI** - Built with shadcn/ui components and smooth Framer Motion animations

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Image Capture**: html2canvas (for receipt generation)
- **Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or Bun package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd elysian-menu-new

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start the development server
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build
# or
bun run build
```

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
# or
bun run preview
```

### Testing

```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npx playwright test
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `dev` | Start development server |
| `build` | Build for production |
| `build:dev` | Build for development |
| `preview` | Preview production build |
| `test` | Run unit tests once |
| `test:watch` | Run unit tests in watch mode |
| `lint` | Run ESLint |

## Project Structure

```
├── public/
│   └── favicon.png
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── DishSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── LocationSection.tsx
│   │   ├── ReservationList.tsx
│   │   ├── ReservationModal.tsx
│   │   └── ...
│   ├── hooks/
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   └── Index.tsx
│   ├── services/
│   │   └── storageService.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Key Dependencies

- **@radix-ui/react-*** - Accessible UI primitives
- **framer-motion** - Animation library
- **html2canvas** - HTML to canvas/image conversion
- **lucide-react** - Icon library
- **react-hook-form** - Form management
- **sonner** - Toast notifications
- **tailwind-merge** + **clsx** - Utility class merging
- **zod** - Schema validation

## Features in Detail

### Menu Display
- Categorized menu sections (Starters, Mains, Desserts, Drinks)
- Beautiful dish cards with descriptions and pricing
- Elegant typography and spacing

### Reservation System
- Select date from calendar picker
- Choose time slot
- Specify party size
- Select table type preference
- Enter guest details with validation
- Confirmation code generation

### Receipt Management
- Individual receipt viewing per reservation
- Receipt download as PNG image
- Professional receipt layout with restaurant branding

## License

MIT License - feel free to use this project as a template for your own restaurant website.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS.

Deplyed project link: 
