import { supabase, TABLES } from '../lib/supabase.js'
import { quickbooksService, initializeQuickBooks } from './quickbooks.js'

// Student and Parent Lookup
export async function lookupStudent(searchTerm) {
  try {
    // 1) Try to find a parent by phone/email (no implicit relationship usage)
    const { data: parent, error: parentError } = await supabase
      .from(TABLES.PARENTS)
      .select('*')
      .or(`phone.eq.${searchTerm},email.eq.${searchTerm}`)
      .maybeSingle()

    if (parentError) throw parentError

    if (parent) {
      // Fetch children explicitly via parent_id to avoid relationship requirements
      const { data: children, error: childrenError } = await supabase
        .from(TABLES.STUDENTS)
        .select('*')
        .eq('parent_id', parent.id)

      if (childrenError) throw childrenError

      if (!children || children.length === 0) {
        throw new Error('No students found for this parent')
      }

      return {
        success: true,
        parent: {
          id: parent.id,
          first_name: parent.first_name,
          middle_name: parent.middle_name,
          last_name: parent.last_name,
          phone: parent.phone,
          email: parent.email
        },
        students: children.map(student => ({
          id: student.id,
          student_id: student.student_id,
          first_name: student.first_name,
          middle_name: student.middle_name,
          last_name: student.last_name,
          grade: student.grade,
          balance: student.balance
        }))
      }
    }

    // 2) Fallback: find by student_id, then load its parent explicitly
    const { data: student, error: studentError } = await supabase
      .from(TABLES.STUDENTS)
      .select('*')
      .eq('student_id', searchTerm)
      .maybeSingle()

    if (studentError) throw studentError
    if (!student) throw new Error('No students found for this search term')

    const { data: foundParent, error: loadParentError } = await supabase
      .from(TABLES.PARENTS)
      .select('*')
      .eq('id', student.parent_id)
      .maybeSingle()

    if (loadParentError) throw loadParentError

    return {
      success: true,
      parent: foundParent
        ? {
            id: foundParent.id,
            first_name: foundParent.first_name,
            middle_name: foundParent.middle_name,
            last_name: foundParent.last_name,
            phone: foundParent.phone,
            email: foundParent.email
          }
        : null,
      students: [{
        id: student.id,
        student_id: student.student_id,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        grade: student.grade,
        balance: student.balance
      }]
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Get student fees/balances
export async function getStudentFees(studentId) {
  try {
    const { data, error } = await supabase
      .from(TABLES.STUDENT_FEES)
      .select(`
        *,
        fee_types:fee_types(*),
        academic_years:academic_years(*),
        academic_terms:academic_terms(*)
      `)
      .eq('student_id', studentId)
      .order('due_date', { ascending: true })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Get student payments
export async function getStudentPayments(studentId) {
  try {
    const { data, error } = await supabase
      .from(TABLES.PAYMENTS)
      .select('*')
      .eq('student_id', studentId)
      .order('payment_date', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Get fee types
export async function getFeeTypes() {
  try {
    const { data, error } = await supabase
      .from(TABLES.FEE_TYPES)
      .select('*')
      .order('name')

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Get academic years
export async function getAcademicYears() {
  try {
    const { data, error } = await supabase
      .from(TABLES.ACADEMIC_YEARS)
      .select('*')
      .order('year_name', { ascending: false })

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Get academic terms
export async function getAcademicTerms() {
  try {
    const { data, error } = await supabase
      .from(TABLES.ACADEMIC_TERMS)
      .select(`
        *,
        academic_years:academic_years(*)
      `)
      .order('term_name')

    if (error) throw error

    return {
      success: true,
      data: data || []
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Request new student fee
export async function requestStudentFee(feeData) {
  try {
    const { data, error } = await supabase
      .from(TABLES.STUDENT_FEES)
      .insert([{
        student_id: feeData.student_id,
        fee_type_id: feeData.fee_type_id,
        academic_year_id: feeData.academic_year_id,
        academic_term_id: feeData.academic_term_id,
        amount: feeData.amount,
        due_date: feeData.due_date,
        status: 'pending'
      }])
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Make payment
export async function makePayment(paymentData) {
  try {
    const { items, total, parentData, studentData } = paymentData

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from(TABLES.PAYMENTS)
      .insert([{
        student_id: items[0]?.student_id, // Assuming all items are for same student
        amount: total,
        description: `Payment for ${items.length} item(s)`,
        receipt_number: `RCP${Date.now()}`,
        payment_method: 'online',
        status: 'completed'
      }])
      .select()
      .single()

    if (paymentError) throw paymentError

    // Update student fees with paid amounts
    for (const item of items) {
      if (item.fee_id) {
        await supabase
          .from(TABLES.STUDENT_FEES)
          .update({ 
            paid_amount: item.amount,
            status: 'paid'
          })
          .eq('id', item.fee_id)
      }
    }

    // Sync to QuickBooks if connected
    let quickbooksResult = null;
    if (initializeQuickBooks() && parentData && studentData) {
      try {
        // Get fee details for QuickBooks sync
        const feeIds = items.filter(item => item.fee_id).map(item => item.fee_id);
        if (feeIds.length > 0) {
          const { data: fees } = await supabase
            .from(TABLES.STUDENT_FEES)
            .select(`
              *,
              fee_types:fee_types(*)
            `)
            .in('id', feeIds);

          quickbooksResult = await quickbooksService.syncPaymentToQuickBooks(
            parentData,
            studentData,
            fees || [],
            total
          );
        }
      } catch (qbError) {
        console.error('QuickBooks sync failed:', qbError);
        // Don't fail the payment if QuickBooks sync fails
        quickbooksResult = {
          success: false,
          error: qbError.message
        };
      }
    }

    return {
      success: true,
      transaction_id: payment.id,
      data: payment,
      quickbooks: quickbooksResult
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}
