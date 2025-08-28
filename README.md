# SuddenlySpaces - AI-Powered Rental Marketplace

SuddenlySpaces is building the "Stripe of rental": an AI-powered rental marketplace that connects property owners and tenants through multiple property types (coworking, residential, and short-term).

## 🚀 Features

### Owner Panel

- ✅ Add new properties (title, location, rent amount, lease type)
- ✅ View and edit listed properties
- ✅ Risk assessment for potential tenants
- ✅ Dashboard with detailed metrics and charts
- ✅ Pagination for better performance

### Tenant Search View

- ✅ Browse available properties
- ✅ Apply basic filters (price range, city, property type)
- ✅ Pagination for long property lists

### Backend API

- ✅ Complete CRUD for property management
- ✅ Simple risk score endpoint (random number between 0-100)
- ✅ Authentication with roles (owners vs tenants)
- ✅ Data validation with Zod
- ✅ PATCH endpoint for property editing

## 🛠️ Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials
- **Validation**: Zod
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd test-project-SuddenlySpaces
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file based on `env.example`:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# App
NODE_ENV="development"
```

#### 🔑 How to Generate NEXTAUTH_SECRET

The `NEXTAUTH_SECRET` is a crucial security key used by NextAuth.js for:

- Encrypting JWT tokens
- Signing cookies
- Securing session data

**Generate a secure secret using one of these methods:**

**Option 1: Using OpenSSL (Recommended)**

```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Using Online Generator**
Visit: https://generate-secret.vercel.app/32

**Option 4: Using Python**

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**⚠️ Security Requirements:**

- Use at least 32 characters
- Include a mix of letters, numbers, and special characters
- Keep it secret and never commit it to version control
- Use different secrets for development, staging, and production

**Example of a generated secret:**

```
NEXTAUTH_SECRET="dK8x#mP9$vL2@nQ7&hF4!jR5*wE8^tY3%uI6(oA1)sZ0"
```

### 4. Configure the database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# (Optional) View database with Prisma Studio
pnpm db:studio
```

### 5. Run the project

```bash
pnpm dev
```

The project will be available at `http://localhost:3000`

## 🗄️ Database Structure

### Main Models

#### User

- `id`: Unique identifier
- `name`: Full name
- `email`: Unique email
- `password`: Hashed password
- `role`: User role (OWNER/TENANT)
- `createdAt/updatedAt`: Timestamps

#### Property

- `id`: Unique identifier
- `title`: Property title
- `description`: Optional description
- `location`: Address
- `city`: City
- `rentAmount`: Rent amount
- `propertyType`: Property type (COWORKING/RESIDENTIAL/SHORT_TERM)
- `leaseType`: Lease type (MONTHLY/YEARLY/FLEXIBLE)
- `isAvailable`: Availability
- `ownerId`: Reference to owner

#### Application

- `id`: Unique identifier
- `propertyId`: Reference to property
- `tenantId`: Reference to tenant
- `status`: Application status (PENDING/APPROVED/REJECTED)
- `riskScore`: Risk score (0-100)

## 🔐 Authentication and Authorization

### User Roles

- **OWNER**: Can create, edit and manage properties, view applications
- **TENANT**: Can browse properties and apply to them

### Authentication Flow

1. Registration with email and password
2. Role selection during registration
3. Login with credentials
4. Redirect to dashboard based on role

## 📡 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

### Properties

- `GET /api/properties` - Get properties with filters
- `POST /api/properties` - Create new property (owners only)
- `GET /api/properties/my-properties` - Get user properties (owners only)
- `PATCH /api/properties/[id]` - Edit existing property (owners only)
- `DELETE /api/properties/[id]` - Delete property (owners only)

### Risk Assessment

- `GET /api/tenants` - Get real tenants from database with fictional additional data
- `GET /api/risk-score` - Generate fictional risk score (random number 0-100)

## 🎨 Arquitectura del Frontend

### Component Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard with metrics
│   ├── properties/        # Property search with pagination
│   ├── my-properties/     # Property management with editing
│   ├── risk-assessment/   # Tenant risk assessment
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base components (Button, Input, Card)
│   ├── auth-provider.tsx # NextAuth provider
│   ├── owner-dashboard.tsx
│   └── tenant-dashboard.tsx
├── lib/                  # Utilities and configuration
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   └── utils.ts         # General utilities
└── types/               # TypeScript type definitions
```

### UI/UX Features

- Responsive design with Tailwind CSS
- Reusable and consistent components
- Loading states and error handling
- Intuitive role-based navigation
- Advanced search filters
- **Pagination** for improved performance
- **Dashboard with charts** and detailed metrics
- **Modal editing forms**

## 🔧 Compromise Decisions

### Time vs Scalability

#### MVP Decisions (Time)

- **Fictional risk score**: Simple implementation with random numbers
- **Basic validation**: Server-side validation with Zod
- **Simple UI**: Basic components without complex libraries
- **Client-side pagination**: For small to medium lists

#### Scalability Preparation

- **Modular architecture**: Clear separation of responsibilities
- **TypeScript**: Strong typing to prevent errors
- **Prisma ORM**: Versioned migrations and schema
- **RESTful API**: Well-structured endpoints
- **Reusable components**: Solid foundation for expansion
- **Server-side pagination**: Implemented for better performance
- **Dashboard with metrics**: Foundation for advanced analytics

## 🚀 Scalability Roadmap

### Phase 1: Server-Side Pagination ✅ COMPLETED

- **Server-side pagination**: Implemented in all property endpoints
- **Optimized queries**: Using Prisma's `take` and `skip` for efficient data loading
- **Pagination metadata**: Total count, pages, and navigation state
- **Frontend integration**: Updated all pages to use server pagination

### Phase 2: Infrastructure & Performance

- **Redis caching**: For sessions and frequently accessed data
- **CDN integration**: For static assets and images
- **Rate limiting**: API protection against abuse
- **Structured logging**: Winston or Pino for better debugging

### Phase 3: Monitoring & Testing

- **Error tracking**: Sentry integration for error monitoring
- **Performance monitoring**: Real-time performance metrics
- **Unit testing**: Jest and React Testing Library
- **Integration testing**: API endpoint testing
- **CI/CD pipeline**: GitHub Actions for automated deployment

### Phase 4: Advanced Features

- **Advanced search**: Elasticsearch integration
- **Real-time features**: WebSocket for live updates
- **File uploads**: Image and document management
- **Email notifications**: Transactional email system

### Phase 5: Enterprise Features

- **Microservices architecture**: Service separation by domain
- **Load balancing**: Horizontal scaling capabilities
- **Database optimization**: Query optimization and indexing
- **Security hardening**: Advanced security measures

## 🚀 Project Features

### ✅ Authentication & Authorization

- **User Registration & Login**: Secure authentication with NextAuth.js
- **Role-Based Access**: OWNER and TENANT roles with different permissions
- **Session Management**: JWT-based session handling
- **Protected Routes**: Automatic redirection for unauthorized access

### ✅ Property Management

- **Property Creation**: Owners can create new properties with detailed information
- **Property Editing**: Modal forms for editing existing properties with real-time validation
- **Property Deletion**: Secure deletion with confirmation dialogs
- **Property Listing**: Browse all available properties with filters
- **My Properties**: Owners can manage their own property portfolio

### ✅ Advanced Search & Filtering

- **Multi-Criteria Filters**: City, price range, property type, lease type
- **Real-time Search**: Instant filtering as you type
- **Filter Persistence**: Filters maintained across page navigation
- **Search Results**: Clear display of filtered properties

### ✅ Pagination System

- **Server-Side Pagination**: Optimized database queries with Prisma's `take` and `skip`
- **Navigation Controls**: Previous/Next buttons with page indicators
- **Performance Optimization**: Only loads necessary data per page
- **Responsive Design**: Works seamlessly on all device sizes

### ✅ Dashboard & Analytics

- **Owner Dashboard**: Comprehensive overview with key metrics
- **Property Statistics**: Total properties, available units, occupancy rates
- **Revenue Tracking**: Monthly revenue calculations and projections
- **Visual Charts**: Property type distribution and city analysis
- **Quick Actions**: Direct access to common tasks

### ✅ Risk Assessment System

- **Tenant Database**: Real tenants from database with fictional additional data
- **Visual Selection**: Interactive tenant selection interface
- **Search & Filter**: Find specific tenants quickly
- **Risk Scoring**: Simple endpoint returning random risk scores (0-100)
- **Owner Interface**: Intuitive risk assessment for property owners

### ✅ Modern UI/UX

- **Responsive Design**: Tailwind CSS with mobile-first approach
- **Component Library**: Reusable UI components for consistency
- **Loading States**: Smooth loading indicators and transitions
- **Toast Notifications**: User-friendly feedback for all actions
- **Modal Forms**: Clean editing and creation interfaces
- **Gradient Design**: Modern visual styling with backdrop blur effects

### ✅ Technical Features

- **TypeScript**: Full type safety throughout the application
- **Prisma ORM**: Type-safe database operations and migrations
- **Next.js 14**: Latest App Router with server components
- **API Routes**: RESTful endpoints with proper error handling
- **Database**: PostgreSQL with optimized queries and relationships
- **Security**: Input validation, authentication, and authorization

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License. See the `LICENSE` file for more details.

---

**Note**: This is a demonstration project that shows the technical and product capabilities for a rental marketplace. For production use, it is recommended to implement the security and scalability improvements mentioned.
