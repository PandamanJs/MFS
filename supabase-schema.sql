-- Supabase Database Schema for School Fees Management System

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Parents table
CREATE TABLE parents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  phone TEXT UNIQUE,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  grade TEXT,
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fee types table
CREATE TABLE fee_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic years table
CREATE TABLE academic_years (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year_name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic terms table
CREATE TABLE academic_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  term_name TEXT NOT NULL,
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student fees table
CREATE TABLE student_fees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  fee_type_id UUID REFERENCES fee_types(id),
  academic_year_id UUID REFERENCES academic_years(id),
  academic_term_id UUID REFERENCES academic_terms(id),
  amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, paid, overdue
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  notes TEXT,
  receipt_number TEXT UNIQUE,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_method TEXT DEFAULT 'online',
  status TEXT DEFAULT 'completed', -- pending, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_students_parent_id ON students(parent_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_student_fees_student_id ON student_fees(student_id);
CREATE INDEX idx_student_fees_status ON student_fees(status);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);

-- Enable Row Level Security
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - adjust based on your auth needs)
CREATE POLICY "Allow all operations on parents" ON parents FOR ALL USING (true);
CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations on fee_types" ON fee_types FOR ALL USING (true);
CREATE POLICY "Allow all operations on academic_years" ON academic_years FOR ALL USING (true);
CREATE POLICY "Allow all operations on academic_terms" ON academic_terms FOR ALL USING (true);
CREATE POLICY "Allow all operations on student_fees" ON student_fees FOR ALL USING (true);
CREATE POLICY "Allow all operations on payments" ON payments FOR ALL USING (true);

-- Insert sample data
INSERT INTO parents (first_name, last_name, phone, email) VALUES
('John', 'Doe', '+260 97 999 9999', 'john.doe@email.com'),
('Jane', 'Smith', '+260 97 888 8888', 'jane.smith@email.com');

INSERT INTO students (student_id, first_name, last_name, grade, parent_id, balance) VALUES
('STU001', 'Alice', 'Doe', 'Grade 5', (SELECT id FROM parents WHERE phone = '+260 97 999 9999'), 150.00),
('STU002', 'Bob', 'Doe', 'Grade 3', (SELECT id FROM parents WHERE phone = '+260 97 999 9999'), 200.00),
('STU003', 'Charlie', 'Smith', 'Grade 7', (SELECT id FROM parents WHERE phone = '+260 97 888 8888'), 100.00);

INSERT INTO fee_types (name, description) VALUES
('Tuition', 'Monthly tuition fees'),
('Books', 'Textbook and stationery fees'),
('Sports', 'Sports and extracurricular activities'),
('Transport', 'School bus transportation fees');

INSERT INTO academic_years (year_name, start_date, end_date, is_active) VALUES
('2024-2025', '2024-01-01', '2024-12-31', true),
('2023-2024', '2023-01-01', '2023-12-31', false);

INSERT INTO academic_terms (term_name, academic_year_id, start_date, end_date, is_active) VALUES
('Term 1', (SELECT id FROM academic_years WHERE year_name = '2024-2025'), '2024-01-01', '2024-04-30', true),
('Term 2', (SELECT id FROM academic_years WHERE year_name = '2024-2025'), '2024-05-01', '2024-08-31', false),
('Term 3', (SELECT id FROM academic_years WHERE year_name = '2024-2025'), '2024-09-01', '2024-12-31', false);

-- Insert sample student fees
INSERT INTO student_fees (student_id, fee_type_id, academic_year_id, academic_term_id, amount, paid_amount, due_date, status) VALUES
((SELECT id FROM students WHERE student_id = 'STU001'), (SELECT id FROM fee_types WHERE name = 'Tuition'), (SELECT id FROM academic_years WHERE is_active = true), (SELECT id FROM academic_terms WHERE is_active = true), 100.00, 50.00, '2024-02-15', 'pending'),
((SELECT id FROM students WHERE student_id = 'STU001'), (SELECT id FROM fee_types WHERE name = 'Books'), (SELECT id FROM academic_years WHERE is_active = true), (SELECT id FROM academic_terms WHERE is_active = true), 50.00, 0.00, '2024-02-20', 'pending'),
((SELECT id FROM students WHERE student_id = 'STU002'), (SELECT id FROM fee_types WHERE name = 'Tuition'), (SELECT id FROM academic_years WHERE is_active = true), (SELECT id FROM academic_terms WHERE is_active = true), 100.00, 0.00, '2024-02-15', 'pending');

-- Insert sample payments
INSERT INTO payments (student_id, amount, description, receipt_number, payment_date) VALUES
((SELECT id FROM students WHERE student_id = 'STU001'), 50.00, 'Tuition payment - Term 1', 'RCP001', '2024-01-15'),
((SELECT id FROM students WHERE student_id = 'STU001'), 25.00, 'Books payment', 'RCP002', '2024-01-20'),
((SELECT id FROM students WHERE student_id = 'STU002'), 100.00, 'Full tuition payment', 'RCP003', '2024-01-10');
