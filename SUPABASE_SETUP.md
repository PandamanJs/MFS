# Supabase Migration Setup Guide

This project has been migrated from a custom backend to use Supabase as the database and API layer.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A QuickBooks Developer account (sign up at https://developer.intuit.com)
3. Node.js and npm installed

## Setup Steps

### 1. Create a Supabase Project

1. Go to https://supabase.com and create a new project
2. Note down your project URL and anon key from the project settings

### 2. Set up the Database

1. In your Supabase project dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase-schema.sql` into the SQL editor
3. Run the SQL to create all tables, indexes, and sample data

### 3. Set up QuickBooks Integration

1. Go to https://developer.intuit.com and create a new app
2. Choose "QuickBooks Online API" as the integration type
3. Note down your Client ID and Client Secret
4. Set the redirect URI to: `http://localhost:5173/qb-callback` (for development)
5. For production, use your domain: `https://yourdomain.com/qb-callback`

### 4. Configure Environment Variables

1. Copy `env.example` to `.env` in the project root
2. Fill in your Supabase and QuickBooks credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_QB_CLIENT_ID=your_quickbooks_client_id
VITE_QB_CLIENT_SECRET=your_quickbooks_client_secret
```

### 5. Install Dependencies and Run

```bash
npm install
npm run dev
```

## What Changed

### Backend Migration
- **Before**: Custom REST API at `http://localhost:8000`
- **After**: Supabase client with direct database queries + QuickBooks integration

### QuickBooks Integration
- **Automatic Transaction Sync**: Payments are automatically synced to QuickBooks as invoices and payments
- **Customer Management**: Parents are created as customers in QuickBooks
- **Real-time Updates**: All financial data flows seamlessly between the school system and QuickBooks

### API Endpoints Replaced
- `POST /lookup` → `lookupStudent()` function
- `GET /students/{id}/fees` → `getStudentFees()` function  
- `GET /students/{id}/payments` → `getStudentPayments()` function
- `GET /financial/fee-types` → `getFeeTypes()` function
- `GET /financial/academic-years` → `getAcademicYears()` function
- `GET /financial/academic-terms` → `getAcademicTerms()` function
- `POST /financial/student-fees/request` → `requestStudentFee()` function
- `POST /payments/make-payment` → `makePayment()` function

### Database Schema
The Supabase database includes these tables:
- `parents` - Parent/guardian information
- `students` - Student information linked to parents
- `fee_types` - Types of fees (tuition, books, etc.)
- `academic_years` - Academic year information
- `academic_terms` - Term information within years
- `student_fees` - Individual fee records for students
- `payments` - Payment transaction records

### Sample Data
The schema includes sample data for testing:
- 2 parents with phone numbers `+260 97 999 9999` and `+260 97 888 8888`
- 3 students (Alice Doe, Bob Doe, Charlie Smith)
- Fee types (Tuition, Books, Sports, Transport)
- Academic years and terms
- Sample student fees and payments

## Testing the Migration

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Try searching with the sample phone number: `+260 97 999 9999`
4. Test the payment flows and receipt viewing
5. **Test QuickBooks Integration**:
   - Click "Connect to QuickBooks" on the home page
   - Complete OAuth flow (or use manual setup for testing)
   - Make a test payment and verify it appears in QuickBooks

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Make sure you've created `.env` file with correct Supabase credentials

2. **"No students found"**
   - Check that the database schema was created successfully
   - Verify the sample data was inserted

3. **CORS errors**
   - Supabase handles CORS automatically, but check your project settings

4. **RLS (Row Level Security) errors**
   - The schema includes permissive policies for development
   - For production, you'll want to implement proper authentication and RLS policies

5. **QuickBooks OAuth errors**
   - Make sure your redirect URI matches exactly in QuickBooks app settings
   - Check that Client ID and Secret are correct
   - Ensure you're using the right environment (sandbox vs production)

6. **QuickBooks API errors**
   - Verify your QuickBooks company is set up correctly
   - Check that you have the right permissions for accounting operations
   - Some operations may require specific QuickBooks plans

### Database Queries

You can verify data in your Supabase dashboard:
- Go to Table Editor
- Check the `parents`, `students`, `student_fees`, and `payments` tables
- Verify sample data is present

## Next Steps

1. **Authentication**: Implement proper user authentication with Supabase Auth
2. **RLS Policies**: Create proper row-level security policies for production
3. **Real-time**: Add real-time subscriptions for live updates
4. **File Storage**: Use Supabase Storage for receipt PDFs and documents
5. **Edge Functions**: Create serverless functions for complex business logic
6. **QuickBooks Enhancements**:
   - Add support for different payment methods in QuickBooks
   - Implement automatic invoice reminders
   - Add QuickBooks reporting integration
   - Support for multiple QuickBooks companies
7. **Production Deployment**: Deploy to production with proper environment variables and security
