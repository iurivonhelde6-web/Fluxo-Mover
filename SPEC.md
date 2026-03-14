# Mover Fluxo - Cash Flow & Customer Management Application

## 1. Project Overview

**Project Name:** Mover Fluxo  
**Type:** Full Stack Web Application  
**Core Functionality:** A sophisticated cash flow management and customer relationship system with real-time financial visualization  
**Target Users:** Small business owners, freelancers, and internal finance teams

---

## 2. UI/UX Specification

### Layout Structure

**Page Sections:**
- **Sidebar Navigation** (fixed left, 280px width on desktop, collapsible on mobile)
- **Main Content Area** (fluid width, scrollable)
- **Header Bar** (sticky top within main area, contains page title and user actions)

**Responsive Breakpoints:**
- Mobile: < 768px (sidebar becomes hamburger menu)
- Tablet: 768px - 1024px (condensed sidebar)
- Desktop: > 1024px (full sidebar)

### Visual Design

**Color Palette (Earth Tones):**
```css
--color-bg-primary: #F5F5F0        /* Stone-50 - Main background */
--color-bg-secondary: #FAFAF9     /* Stone-25 - Card backgrounds */
--color-bg-sidebar: #292524       /* Stone-800 - Dark sidebar */
--color-text-primary: #1C1917     /* Stone-900 - Main text */
--color-text-secondary: #57534E   /* Stone-600 - Secondary text */
--color-text-muted: #A8A29E       /* Stone-400 - Muted text */
--color-accent-primary: #B45309   /* Amber-700 - Primary accent */
--color-accent-secondary: #C2410C /* Terracotta-700 - Secondary accent */
--color-success: #15803D         /* Sage-700 - Green for income */
--color-danger: #B91C1C           /* Red-700 - For expenses */
--color-border: #E7E5E4           /* Stone-200 - Borders */
--color-glass: rgba(255, 255, 255, 0.15) /* Glassmorphism overlay */
```

**Typography:**
- Font Family: "Outfit" (headings), "DM Sans" (body)
- Headings: 32px (h1), 24px (h2), 18px (h3)
- Body: 14px regular, 14px medium
- Small: 12px

**Spacing System:**
- Base unit: 4px
- Margins: 16px, 24px, 32px
- Paddings: 8px, 12px, 16px, 24px
- Gap: 8px, 16px, 24px

**Visual Effects:**
- Glassmorphism: backdrop-blur-md with bg-opacity-15
- Shadows: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)
- Border radius: 8px (cards), 6px (buttons), 4px (inputs)
- Transitions: 200ms ease-in-out for all interactive elements
- Hover effects: scale(1.02) on cards, brightness increase on buttons

### Components

**Navigation Sidebar:**
- Logo at top
- Menu items: Dashboard, Clientes, Transações
- Active state: amber accent left border
- Hover: subtle background lightening

**Dashboard Cards:**
- Glassmorphism effect
- Summary cards for Balance, Income, Expenses
- Animated number counters on load
- Hover: slight lift effect

**Data Tables:**
- Striped rows with stone-50/white alternating
- Sticky header
- Action buttons (edit/delete) with icon buttons
- Pagination controls

**Forms:**
- Floating labels
- Input focus: amber ring
- Error states: red border with message below
- Success states: green checkmark

**Modals:**
- Centered overlay with backdrop blur
- Smooth scale-in animation
- Close button top-right

**Buttons:**
- Primary: Amber background, white text
- Secondary: Stone outline
- Danger: Red background
- All have hover brightness increase

**Charts (Recharts):**
- Area Chart: Gradient fill for income
- Bar Chart: Side-by-side bars for income/expenses
- Pie Chart: Category distribution
- Tooltips with glassmorphism effect

---

## 3. Functionality Specification

### Core Features

**Authentication (Supabase):**
- Email/Password login
- Session persistence
- Protected routes

**Client Management (CRUD):**
- List all clients with search/filter
- Create new client with validation
- Edit existing client
- Delete client (soft delete or cascade)
- Fields: id, nome, cpf, cep, endereco, email, created_at, updated_at
- CPF validation (11 digits)
- CEP auto-fill via ViaCEP API

**Transaction Management (CRUD):**
- List all transactions with filters (date range, type, category)
- Create new transaction linked to client
- Edit transaction
- Delete transaction
- Fields: id, cliente_id, tipo (entrada/saida), valor, categoria, data, descricao, created_at
- Categories: Aluguel, Vendas, Serviços, Salário, Fornecimento, Manutenção, Outros

**Dashboard:**
- Real-time summary cards
- Income vs Expense chart
- Category distribution pie chart
- Recent transactions list

### User Interactions

1. **Add Client:** Click "Novo Cliente" → Modal opens → Fill form → Auto-fill CEP → Submit → Success notification
2. **Edit Client:** Click edit icon → Modal with pre-filled data → Modify → Submit → Success notification
3. **Delete Client:** Click delete icon → Confirmation modal → Confirm → Success notification
4. **Add Transaction:** Click "Nova Transação" → Select client → Fill details → Submit → Update charts
5. **Filter Transactions:** Use date picker and dropdown filters → Table updates in real-time

### Data Handling

- All API calls via Supabase client
- Optimistic UI updates
- Error handling with user-friendly messages
- Loading states with skeletons
- Data validation on both client and server

### Edge Cases

- Empty states with call-to-action
- Network error handling
- Invalid CPF format
- Invalid CEP (API returns error)
- Delete client with existing transactions (show warning)
- Negative balance display

---

## 4. Technical Architecture

### Project Structure
```
/src
  /components
    /ui          # Reusable UI components
    /layout      # Layout components (Sidebar, Header)
    /clients     # Client-related components
    /transactions # Transaction-related components
    /dashboard   # Dashboard components
  /hooks         # Custom React hooks
  /lib           # Utilities and helpers
    supabase.js  # Supabase client config
    validations.js # Form validations
    formatters.js  # Data formatters
  /pages         # Page components
  App.jsx        # Main app with routes
  main.jsx       # Entry point
  index.css      # Global styles + Tailwind
```

### Database Schema (PostgreSQL)

**Table: clientes**
```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  cep VARCHAR(9),
  endereco TEXT,
  email VARCHAR(255),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Table: transacoes**
```sql
CREATE TABLE transacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  valor DECIMAL(12,2) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  data DATE NOT NULL,
  descricao TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**RLS Policies:**
- Clients: Users can only see/edit their own clients
- Transactions: Users can only see/edit their own transactions

---

## 5. Acceptance Criteria

### Visual Checkpoints
- [ ] Sidebar renders with all navigation items
- [ ] Dashboard shows 3 summary cards with glassmorphism
- [ ] Charts render with proper colors and tooltips
- [ ] Tables have alternating row colors
- [ ] Forms show validation errors properly
- [ ] Modals animate smoothly
- [ ] Loading skeletons appear during data fetch

### Functional Checkpoints
- [ ] User can register and login
- [ ] User can create, read, update, delete clients
- [ ] CPF validation works (shows error for invalid CPF)
- [ ] CEP auto-fill works via ViaCEP
- [ ] User can create, read, update, delete transactions
- [ ] Transactions linked to clients via foreign key
- [ ] Dashboard charts update when data changes
- [ ] Filters work on transaction list
- [ ] Error messages display on failed operations
- [ ] Success notifications appear after operations

### Technical Checkpoints
- [ ] No console errors
- [ ] Responsive on all breakpoints
- [ ] RLS policies enforced at database level
- [ ] Clean Code principles followed
- [ ] Proper error handling throughout

