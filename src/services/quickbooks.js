import axios from 'axios';

// QuickBooks API configuration
const QB_BASE_URL = 'https://sandbox-quickbooks.api.intuit.com'; // Use production URL for live
const QB_API_VERSION = 'v3';

class QuickBooksService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.realmId = null;
    this.companyId = null;
  }

  // Initialize with OAuth tokens
  initialize(accessToken, refreshToken, realmId, companyId) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.realmId = realmId;
    this.companyId = companyId;
  }

  // Get authorization headers
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  // Create a customer in QuickBooks
  async createCustomer(parentData) {
    try {
      const customerData = {
        Name: `${parentData.first_name} ${parentData.last_name}`,
        CompanyName: parentData.last_name,
        GivenName: parentData.first_name,
        FamilyName: parentData.last_name,
        PrimaryEmailAddr: {
          Address: parentData.email || `${parentData.first_name.toLowerCase()}.${parentData.last_name.toLowerCase()}@school.com`
        },
        PrimaryPhone: {
          FreeFormNumber: parentData.phone || '+260 000 000 000'
        },
        BillAddr: {
          Line1: 'School Address',
          City: 'Lusaka',
          Country: 'Zambia'
        }
      };

      const response = await axios.post(
        `${QB_BASE_URL}/${QB_API_VERSION}/company/${this.realmId}/customers`,
        customerData,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        customerId: response.data.QueryResponse?.Customer?.[0]?.Id,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating QuickBooks customer:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Create an invoice for school fees
  async createInvoice(studentData, feeData, customerId) {
    try {
      const invoiceData = {
        CustomerRef: {
          value: customerId
        },
        Line: feeData.map(fee => ({
          DetailType: 'SalesItemLineDetail',
          Amount: fee.amount,
          SalesItemLineDetail: {
            ItemRef: {
              value: '1' // Default service item - you may want to create specific items
            },
            Qty: 1,
            UnitPrice: fee.amount
          },
          Description: `${fee.fee_types?.name || 'School Fee'} - ${studentData.first_name} ${studentData.last_name} (${studentData.grade})`
        })),
        TxnDate: new Date().toISOString().split('T')[0],
        DueDate: feeData[0]?.due_date || new Date().toISOString().split('T')[0],
        DocNumber: `INV-${studentData.student_id}-${Date.now()}`,
        PrivateNote: `School fees for ${studentData.first_name} ${studentData.last_name} - ${studentData.grade}`
      };

      const response = await axios.post(
        `${QB_BASE_URL}/${QB_API_VERSION}/company/${this.realmId}/invoices`,
        invoiceData,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        invoiceId: response.data.QueryResponse?.Invoice?.[0]?.Id,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating QuickBooks invoice:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Record a payment against an invoice
  async recordPayment(invoiceId, paymentAmount, paymentMethod = 'Cash') {
    try {
      const paymentData = {
        PaymentRefNum: `PAY-${Date.now()}`,
        TotalAmt: paymentAmount,
        TxnDate: new Date().toISOString().split('T')[0],
        PaymentMethodRef: {
          value: '1' // Cash - you may want to create specific payment methods
        },
        DepositToAccountRef: {
          value: '4' // Undeposited Funds account
        },
        Line: [{
          Amount: paymentAmount,
          LinkedTxn: [{
            TxnId: invoiceId,
            TxnType: 'Invoice'
          }]
        }]
      };

      const response = await axios.post(
        `${QB_BASE_URL}/${QB_API_VERSION}/company/${this.realmId}/payments`,
        paymentData,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        paymentId: response.data.QueryResponse?.Payment?.[0]?.Id,
        data: response.data
      };
    } catch (error) {
      console.error('Error recording QuickBooks payment:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Get customer by email or phone
  async findCustomer(searchTerm) {
    try {
      const response = await axios.get(
        `${QB_BASE_URL}/${QB_API_VERSION}/company/${this.realmId}/customers?query=SELECT * FROM Customer WHERE PrimaryEmailAddr.Address = '${searchTerm}' OR PrimaryPhone.FreeFormNumber = '${searchTerm}'`,
        { headers: this.getHeaders() }
      );

      const customers = response.data.QueryResponse?.Customer || [];
      return {
        success: true,
        customers,
        customerId: customers.length > 0 ? customers[0].Id : null
      };
    } catch (error) {
      console.error('Error finding QuickBooks customer:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Get all invoices for a customer
  async getCustomerInvoices(customerId) {
    try {
      const response = await axios.get(
        `${QB_BASE_URL}/${QB_API_VERSION}/company/${this.realmId}/invoices?query=SELECT * FROM Invoice WHERE CustomerRef = '${customerId}'`,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        invoices: response.data.QueryResponse?.Invoice || []
      };
    } catch (error) {
      console.error('Error getting QuickBooks invoices:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Get all payments for a customer
  async getCustomerPayments(customerId) {
    try {
      const response = await axios.get(
        `${QB_BASE_URL}/${QB_API_VERSION}/company/${this.realmId}/payments?query=SELECT * FROM Payment WHERE CustomerRef = '${customerId}'`,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        payments: response.data.QueryResponse?.Payment || []
      };
    } catch (error) {
      console.error('Error getting QuickBooks payments:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Sync a complete payment transaction to QuickBooks
  async syncPaymentToQuickBooks(parentData, studentData, feeData, paymentAmount) {
    try {
      // Step 1: Find or create customer
      let customerResult = await this.findCustomer(parentData.email || parentData.phone);
      let customerId = customerResult.customerId;

      if (!customerId) {
        customerResult = await this.createCustomer(parentData);
        if (!customerResult.success) {
          throw new Error(`Failed to create customer: ${customerResult.error}`);
        }
        customerId = customerResult.customerId;
      }

      // Step 2: Create invoice for the fees
      const invoiceResult = await this.createInvoice(studentData, feeData, customerId);
      if (!invoiceResult.success) {
        throw new Error(`Failed to create invoice: ${invoiceResult.error}`);
      }

      // Step 3: Record payment against the invoice
      const paymentResult = await this.recordPayment(invoiceResult.invoiceId, paymentAmount);
      if (!paymentResult.success) {
        throw new Error(`Failed to record payment: ${paymentResult.error}`);
      }

      return {
        success: true,
        customerId,
        invoiceId: invoiceResult.invoiceId,
        paymentId: paymentResult.paymentId,
        message: 'Payment successfully synced to QuickBooks'
      };
    } catch (error) {
      console.error('Error syncing payment to QuickBooks:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const quickbooksService = new QuickBooksService();

// Helper function to initialize QuickBooks from environment or stored tokens
export function initializeQuickBooks() {
  const accessToken = localStorage.getItem('qb_access_token');
  const refreshToken = localStorage.getItem('qb_refresh_token');
  const realmId = localStorage.getItem('qb_realm_id');
  const companyId = localStorage.getItem('qb_company_id');

  if (accessToken && realmId) {
    quickbooksService.initialize(accessToken, refreshToken, realmId, companyId);
    return true;
  }
  return false;
}

// Helper function to save QuickBooks tokens
export function saveQuickBooksTokens(accessToken, refreshToken, realmId, companyId) {
  localStorage.setItem('qb_access_token', accessToken);
  localStorage.setItem('qb_refresh_token', refreshToken);
  localStorage.setItem('qb_realm_id', realmId);
  localStorage.setItem('qb_company_id', companyId);
  quickbooksService.initialize(accessToken, refreshToken, realmId, companyId);
}
