# FinRizz

## Current State

New project with default Caffeine scaffold. Frontend is a blank React + TypeScript + Tailwind app. Backend is a Motoko canister with no defined functionality.

## Requested Changes (Diff)

### Add

**Backend (Motoko canister)**
- User data model: id, name, email, passwordHash, investmentWalletBalance
- Transaction data model: id, userId, amount, category, description, roundupAmount, timestamp
- JWT-style session management using stable memory
- `register(name, email, password)` -> returns session token + user
- `login(email, password)` -> returns session token + user
- `addTransaction(token, amount, category, description)` -> stores transaction, calculates roundup (next multiple of 10 - amount), updates wallet balance, returns transaction with roundupAmount
- `getAnalysis(token)` -> returns category totals, monthly spending array, AI advice (rule-based)
- `getInvestments(token)` -> returns totalRoundup, investedAmount, availableAmount, history
- `getTransactions(token)` -> returns recent transactions list

**Frontend Pages**
- `/login` - Login page (email + password, JWT in localStorage, redirect to dashboard)
- `/signup` - Signup page (name, email, password, confirm password)
- `/dashboard` - Summary cards (total spending, total investments, roundup balance), recent transactions, expense pie chart, investment wallet value
- `/add-transaction` - Form (amount, category dropdown, description), shows roundup result after submit
- `/insights` - Spending by category, monthly line chart, AI financial advice
- `/investments` - Wallet summary cards, investment history list

**Frontend Components**
- `Navbar` - Logo, nav links (dashboard, add transaction, insights, investments), logout
- `ProtectedRoute` - Redirects to login if no token
- `TransactionCard` - Displays individual transaction with category badge and roundup info
- `ExpenseChart` - Pie chart using Recharts for spending categories
- `InvestmentCard` - Wallet summary display
- `LoadingSpinner` - Reusable spinner for async states
- Toast notifications for success/error states

**Frontend Services & Context**
- `src/services/api.ts` - Axios-equivalent fetch wrapper with auth header attachment
- `src/context/AuthContext.tsx` - Stores user + token, login/logout methods

### Modify

- `index.css` - Add dark blue/teal fintech color theme with OKLCH tokens
- `main.tsx` - Wrap app with AuthContext provider, add React Router

### Remove

Nothing to remove (new project).

## Implementation Plan

1. Generate Motoko backend with all data models, auth logic, transaction/analysis/investment APIs
2. Build AuthContext with localStorage persistence
3. Build API service layer (using fetch with canister actor calls)
4. Build Navbar and ProtectedRoute components
5. Build Login and Signup pages
6. Build Dashboard with summary cards, recent transactions list, pie chart
7. Build Add Transaction page with roundup display
8. Build Expense Insights page with category chart + line chart + AI advice
9. Build Investment Wallet page with history
10. Build TransactionCard, InvestmentCard, ExpenseChart components
11. Apply fintech design system (dark blue, teal, white, soft shadows)
