# E-Commerce App with Nuxt 4, Vue 3 & Vuetify

A modern e-commerce application built with Nuxt 4, Vue 3, Vuetify, and Drizzle ORM following Domain-Driven Design (DDD) architecture.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Database Setup

### Generate Migrations

Create migrations after modifying your Drizzle schema:

```bash
npm run migrations:make
```

### Run Migrations

Apply pending migrations to your SQLite database:

```bash
npm run migrations:migrate
```

### Seed Database

I haven't shared the seed files for security reasons. If you need them, please contact me directly.
Populate your database with initial data (categories, products, brands, etc.):

```bash
npm run db:seed
```

### Full Database Reset (Development Only)

```bash
# Drop and recreate the database
rm database/sqlite/database.sqlite
npm run migrations:migrate
npm run db:seed
```

## Algolia Search Setup

Index all products for full-text search on Algolia:

```bash
npm run algolia:index
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Project Roadmap

Track your progress on this e-commerce app. Mark items as complete by replacing `[ ]` with `[x]`:

### Phase 1: Foundation & Authentication
- [x] User authentication (login, signup, password reset)
- [ ] Email verification system
- [ ] JWT token management
- [ ] User profile management
- [ ] Password reset functionality

### Phase 2: Product Catalog
- [x] Product listing page
- [ ] Product details page with images
- [x] Product search functionality with Algolia
- [x] Product filtering (by category, brand, price)
- [x] Product sorting (price, popularity, newest)
- [x] Product ratings and reviews
- [x] Product variations/options (colors, sizes, etc.)

### Phase 3: Category Management
- [x] Category hierarchy (nested categories)
- [x] Category tree navigation
- [x] Category images and metadata
- [x] Breadcrumb navigation
- [x] Category filtering in search

### Phase 4: Shopping Cart & Checkout
- [ ] Add/remove products from cart
- [ ] Update cart quantities
- [ ] Cart persistence (localStorage/cookies)
- [ ] Shipping address form
- [ ] Shipping method selection
- [ ] Order summary page
- [ ] Order confirmation

### Phase 5: Payment Integration
- [ ] Stripe payment gateway integration
- [ ] PayPal integration (optional)
- [ ] Payment validation
- [ ] Invoice generation
- [ ] Order receipt emails

### Phase 6: User Dashboard
- [ ] Order history
- [ ] Order tracking
- [ ] Wishlist functionality
- [ ] Saved addresses
- [ ] Account settings

### Phase 7: Admin Panel
- [ ] Admin authentication & authorization
- [ ] Product management (CRUD)
- [ ] Product bulk upload
- [ ] Category management
- [ ] Brand management
- [ ] Order management
- [ ] User management
- [ ] Discount/coupon management
- [ ] Analytics dashboard

### Phase 8: Advanced Features
- [x] Full-text search with Algolia
- [x] Discount codes and coupons
- [ ] Email notifications (orders, shipping, etc.)
- [ ] SMS notifications (optional)
- [ ] Push notifications (optional)
- [ ] Product recommendations
- [ ] Customer reviews and ratings
- [ ] Stock management

### Phase 9: Performance & Optimization
- [ ] Image optimization and CDN integration
- [ ] API response caching
- [ ] Database query optimization
- [ ] Frontend bundle optimization
- [ ] Lazy loading implementation
- [ ] SEO optimization
- [ ] Analytics tracking (Google Analytics)

### Phase 10: Testing & Quality
- [ ] Unit tests for components
- [ ] Unit tests for API endpoints
- [ ] Integration tests
- [ ] End-to-end testing (Cypress/Playwright)
- [ ] Performance testing
- [ ] Security audit

### Phase 11: DevOps & Deployment
- [ ] CI/CD pipeline setup
- [ ] Database backup strategy
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring (APM)
- [ ] Frontend deployment (Vercel/Netlify)
- [ ] Backend deployment (Heroku/AWS)
- [ ] SSL/HTTPS setup
- [ ] CDN configuration

### Phase 12: Post-Launch
- [ ] User feedback collection
- [ ] Bug fixes and patches
- [ ] Performance improvements
- [ ] Feature enhancements
- [ ] Scalability improvements
- [ ] Security updates

---

**Estimated Timeline**: ~12-16 weeks for MVP + advanced features

**Current Status**: Phase 1 - Foundation & Authentication

