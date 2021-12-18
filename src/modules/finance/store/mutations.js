export function GET_INVOICES (state, payload) {
  state.invoices = []
  state.invoices = payload.reverse();
  state.sentInvoices = []
  state.paidInvoices = []
  state.notPaidInvoices = []
  
  for (let i = 0; i<state.invoices.length; i++) {
    if(state.invoices[i].status === 'Sent'){
    state.sentInvoices.push(state.invoices[i])
    }else if(state.invoices[i].status === 'Paid') {
      state.paidInvoices.push(state.invoices[i])
    }
    else if(state.invoices[i].status === 'Not paid') {
      state.notPaidInvoices.push(state.invoices[i])
    }
  }
}

export function GET_INVOICE (state, payload) {
  state.oneInvoice = payload
}


export function GET_QUOTES (state, payload) {
  state.quotes = []
  state.quotes = payload.reverse();
  state.sentQuotes= []
  state.acceptedQuotes = []
  state.rejectedQuotes = []
  
  for (let i = 0; i<state.quotes.length; i++) {
    if(state.quotes[i].status === 'Sent'){
    state.sentQuotes.push(state.quotes[i])
    }else if(state.quotes[i].status === 'Accepted') {
      state.acceptedQuotes.push(state.quotes[i])
    }
    else if(state.quotes[i].status === 'Rejected') {
      state.rejectedQuotes.push(state.quotes[i])
    }
  }
}

export function GET_QUOTE (state, payload) {
  state.oneQuote = payload
}

export function GET_TAXES (state, payload) {
  state.taxes = payload.reverse()
}

export function GET_CATEGORIES (state, payload) {
  state.categories = payload.reverse()
}

export function GET_SUB_CATEGORIES (state, payload) {
  state.subCategories = payload.reverse()
}

export function GET_JOINED_CATEGORIES (state, payload) {
  state.joinedCategories = payload
}

export function GET_SUPPLIERS (state, payload) {
  state.suppliers = payload.reverse()
}

export function GET_PAYMENT_METHODS (state, payload) {
  state.paymentMethods = payload.reverse()
}

export function GET_EXPENSES (state, payload) {
  state.expenses = payload.reverse()
}

export function GET_EXPENSE (state, payload) {
  state.oneExpense = payload
}