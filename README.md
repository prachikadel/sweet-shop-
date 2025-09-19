# Sweet Shop Management System

A comprehensive full-stack web application for managing a sweet shop, built with modern technologies and following Test-Driven Development (TDD) principles.

## 🍬 Project Overview

This Sweet Shop Management System allows users to browse, purchase, and manage sweet inventory through a beautiful, responsive web interface. The system includes user authentication, role-based access control, and real-time inventory management.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based registration and login system
- **Sweet Management**: Full CRUD operations for managing sweets inventory
- **Search & Filter**: Advanced search functionality by name, category, and price range
- **Purchase System**: Real-time inventory tracking with quantity management
- **Admin Features**: Admin-only access to delete sweets and restock inventory
- **Responsive Design**: Beautiful, mobile-first design that works on all devices

### Additional Features
- Real-time inventory updates
- Role-based access control (Admin/User)
- Input validation and error handling
- Loading states and user feedback
- Comprehensive test coverage
- Modern, animated UI with micro-interactions

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Testing**: Vitest with supertest

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library

### Database Schema
- **Users Table**: id, email, password_hash, role, created_at
- **Sweets Table**: id, name, category, price, quantity, description, created_at, updated_at

## 📁 Project Structure

```
src/
├── components/           # Reusable React components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── SweetCard.tsx
│   ├── SweetForm.tsx
│   ├── SearchBar.tsx
│   └── __tests__/       # Component tests
├── pages/               # Page components
│   ├── AuthPage.tsx
│   └── Dashboard.tsx
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   └── useSweets.ts
├── services/            # API service layer
│   └── api.ts
├── server/              # Backend API
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── __tests__/       # Backend tests
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sweet-shop-management-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
1. Copy the `.env.example` file to `.env`
2. Set up a Supabase project at [supabase.com](https://supabase.com)
3. Add your Supabase credentials to the `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
```

### 4. Database Setup
The database schema will be automatically created when you connect to Supabase. The migration file includes:
- Users and sweets tables with proper relationships
- Row Level Security (RLS) policies
- Sample data for testing

### 5. Run the Application

#### Development Mode (Full Stack)
```bash
npm run dev
```
This runs both the frontend (port 5173) and backend (port 3001) concurrently.

#### Individual Services
```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

### 6. Run Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 🧪 Testing Strategy

This project follows Test-Driven Development (TDD) principles with comprehensive test coverage:

### Backend Testing
- **Unit Tests**: Service layer functions with mocked dependencies
- **Integration Tests**: API endpoints with request/response testing
- **Authentication Tests**: JWT token validation and middleware testing

### Frontend Testing
- **Component Tests**: React components with user interactions
- **Hook Tests**: Custom React hooks with state management
- **Form Validation Tests**: Input validation and error handling

### Test Coverage Areas
- User authentication (registration/login)
- Sweet CRUD operations
- Search and filtering functionality
- Purchase and inventory management
- Admin-only features
- Form validation and error handling

## 📱 Usage

### For Customers
1. **Register/Login**: Create an account or sign in
2. **Browse Sweets**: View all available sweets with details
3. **Search & Filter**: Find specific sweets by name, category, or price
4. **Purchase**: Buy sweets (quantity decreases automatically)

### For Administrators
1. **All Customer Features**: Plus additional admin capabilities
2. **Add Sweets**: Create new sweet entries
3. **Edit Sweets**: Update sweet information and pricing
4. **Delete Sweets**: Remove sweets from inventory
5. **Restock**: Increase sweet quantities

## 🎨 Design Philosophy

The application follows Apple-level design aesthetics with:
- **Clean Interface**: Minimalist design with purposeful elements
- **Consistent Spacing**: 8px grid system for perfect alignment
- **Beautiful Colors**: Carefully chosen color palette with proper contrast
- **Smooth Animations**: Micro-interactions that delight users
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access**: Admin and user role permissions
- **Input Validation**: Comprehensive client and server-side validation
- **SQL Injection Protection**: Parameterized queries via Supabase
- **CORS Configuration**: Proper cross-origin request handling

## 🤖 My AI Usage

I leveraged Claude Sonnet 4 throughout this project development to enhance productivity and code quality:

### AI Tools Used
- **Claude Sonnet 4**: Primary AI assistant for code generation, problem-solving, and architectural decisions

### How AI Was Used

1. **Project Architecture**: Used AI to design the overall system architecture, including the separation of concerns between frontend, backend, and database layers.

2. **Boilerplate Generation**: AI helped generate initial boilerplate code for:
   - Express.js server setup with TypeScript
   - React component templates with proper TypeScript interfaces
   - Database migration files with proper SQL syntax
   - Test file structures and basic test cases

3. **Code Quality & Best Practices**: AI assisted with:
   - Implementing SOLID principles in service layers
   - Writing comprehensive TypeScript interfaces and types
   - Creating proper error handling patterns
   - Establishing consistent naming conventions

4. **Test-Driven Development**: AI helped create:
   - Unit test templates for services and components
   - Mock implementations for testing
   - Test data generation and setup
   - Comprehensive test coverage strategies

5. **Documentation**: AI assisted with:
   - Writing clear README documentation
   - Creating inline code comments
   - Generating API endpoint documentation
   - Structuring project documentation

### AI Impact on Workflow

**Positive Impacts:**
- **Faster Development**: AI significantly reduced time spent on boilerplate code and repetitive tasks
- **Better Code Quality**: AI suggestions helped maintain consistency and follow best practices
- **Learning Enhancement**: AI explanations helped me understand advanced TypeScript patterns and React hooks
- **Problem Solving**: AI provided multiple approaches to complex problems, allowing me to choose the best solution

**Balanced Approach:**
- I used AI as a collaborative tool, not a replacement for critical thinking
- All AI-generated code was reviewed, tested, and often modified to fit specific requirements
- I made architectural decisions independently, using AI for implementation guidance
- I maintained ownership of the codebase and ensured all code met project standards

**Reflection:**
AI tools like Claude have become invaluable for modern software development. They excel at handling repetitive tasks, providing best practice guidance, and offering alternative solutions. However, the human developer's role remains crucial for:
- Making strategic architectural decisions
- Understanding business requirements and translating them into code
- Ensuring code quality and maintaining project vision
- Debugging complex issues and optimizing performance

This project demonstrates how AI can enhance developer productivity while maintaining code quality and following TDD principles.

## 📈 Performance Optimizations

- **Efficient Database Queries**: Optimized SQL queries with proper indexing
- **React Optimizations**: Proper use of React hooks and avoiding unnecessary re-renders
- **Lazy Loading**: Components and routes loaded on demand
- **Caching Strategy**: Client-side caching of API responses
- **Bundle Optimization**: Vite's automatic code splitting and tree shaking

## 🚀 Deployment

The application is ready for deployment on modern platforms:

### Frontend Deployment (Netlify/Vercel)
```bash
npm run build:client
```

### Backend Deployment (Railway/Heroku)
```bash
npm run build:server
```

### Environment Variables for Production
Ensure all environment variables are properly configured in your deployment platform.

## 🔮 Future Enhancements

- **Order History**: Track user purchase history
- **Email Notifications**: Order confirmations and low stock alerts
- **Advanced Analytics**: Sales reports and inventory analytics
- **Payment Integration**: Stripe integration for real payments
- **Image Upload**: Sweet images with cloud storage
- **Multi-language Support**: Internationalization
- **Mobile App**: React Native mobile application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for providing an excellent backend-as-a-service platform
- **Tailwind CSS** for the beautiful utility-first CSS framework
- **Lucide React** for the comprehensive icon library
- **Vitest** for the fast and modern testing framework
- **Claude AI** for development assistance and code guidance

---

**Built with ❤️ using modern web technologies and TDD principles**