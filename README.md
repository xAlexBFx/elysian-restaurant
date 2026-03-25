# Élysée Restaurant

*A full-stack React prototype built to demonstrate modern frontend architecture and user experience design.*

<img width="2879" height="1799" alt="Screenshot 2026-03-25 183205" src="https://github.com/user-attachments/assets/2133fd22-abb0-4d77-a413-826254b5971d" />

## About This Project

I built this restaurant reservation application as a portfolio piece to showcase my skills in modern React development, TypeScript, and UI/UX design. The goal was to create a production-quality prototype that demonstrates:

- **End-to-end feature development** - From concept to working reservation system
- **State management patterns** - Handling complex form state and persistent storage
- **UI component architecture** - Building reusable, accessible components with shadcn/ui
- **Animation and polish** - Using Framer Motion for smooth, professional transitions
- **Testing strategy** - Unit tests with Vitest and E2E coverage with Playwright

## What I Built

### Core Features

| Feature | Technical Challenge |
|---------|---------------------|
| **Reservation System** | Multi-step form with React Hook Form + Zod validation |
| **Local Storage Persistence** | Custom storage service with error handling |
| **Receipt Generation** | Canvas-based image export using html2canvas |
| **Responsive Design** | Mobile-first Tailwind CSS with complex layouts |
| **Animations** | Framer Motion page transitions and micro-interactions |

### Tech Stack

- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for accessible, composable UI primitives
- **React Hook Form + Zod** for robust form handling
- **Framer Motion** for declarative animations
- **Vitest + React Testing Library** for unit testing
- **Playwright** for end-to-end testing

## Key Technical Decisions

### Why Local Storage?
I chose browser local storage over a backend to keep the deployment simple while still demonstrating data persistence patterns. The storage service abstracts this away, making it trivial to swap in a real API later.

### Component Architecture
I followed a compound component pattern for the reservation modal, allowing flexible composition while maintaining internal state coherence. The shadcn/ui integration taught me a lot about building truly accessible interfaces.

### Testing Approach
- **Unit tests** focus on business logic and component behavior
- **E2E tests** cover critical user paths: booking a table, viewing reservations, downloading receipts

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
npx playwright test

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/        # React components
│   ├── ui/           # shadcn/ui primitives
│   ├── DishSection.tsx
│   ├── ReservationModal.tsx
│   └── ...
├── services/
│   └── storageService.ts   # Local storage abstraction
├── pages/
│   └── Index.tsx
└── ...
```

## Lessons Learned

- **Form validation** - Zod schemas paired with React Hook Form dramatically reduce boilerplate
- **Canvas generation** - html2canvas has quirks with modern CSS; learned workarounds for flexbox/grid
- **Animation performance** - Framer Motion's `layout` prop is powerful but needs careful use
- **Testing async operations** - Properly testing local storage interactions requires cleanup

## License

MIT - Feel free to use this as a reference or starting point for your own projects.

---

Built as a learning exercise and portfolio piece. Open to feedback and questions!

Deployed project link: https://elysianrestaurant.netlify.app 