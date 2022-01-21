import axios from "axios";

// Invoice

export async function getInvoices({commit}) {
    let response = await axios.get(process.env.OC_BACKEND_API + 'invoices', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_INVOICES' ,response.data.data)
}

export async function getInvoice({commit},id) {
    let response = await axios.get(process.env.OC_BACKEND_API + `invoices/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_INVOICE' ,response.data.data)
}

export async function addInvoice({commit, dispatch}, payload) {
    console.log(payload)
    try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'invoices/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    console.log(response);
    }catch(e) {
        console.log(e.response);
    }
    await dispatch('getInvoices');
}

export async function editInvoice({commit, dispatch}, payload) {
    console.log(payload)
    let response = await axios.post(process.env.OC_BACKEND_API + 'invoices/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    console.log(response)
    await dispatch('getInvoices');
}

export async function deleteInvoice({commit, dispatch}, id) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'invoices/delete', {id: id}, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getInvoices');
}


// Quote

export async function getQuotes({commit}) {
    let response = await axios.get(process.env.OC_BACKEND_API + 'quotes', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_QUOTES' ,response.data.data)
}

export async function getQuote({commit},id) {
    let response = await axios.get(process.env.OC_BACKEND_API + `quotes/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_QUOTE' ,response.data.data)
}

export async function addQuote({commit, dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'quotes/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getQuotes');
}

export async function editQuote({commit, dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'quotes/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getQuotes');
}

export async function deleteQuote({commit, dispatch}, id) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'quotes/delete', {id: id}, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getQuotes');
}


// Tax

export async function getTaxes({commit}) {
    let response = await axios.get(process.env.OC_BACKEND_API + 'taxes', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_TAXES' ,response.data.data);
}

export async function deleteTax({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'taxes/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getTaxes');
}

// Categories

export async function getCategories({commit}) {
    let response = await axios.get(process.env.OC_BACKEND_API + 'expenseCategories', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_CATEGORIES' ,response.data.data);
}

export async function getJoinedCategories({commit}) {
    let response = await axios.get(process.env.OC_BACKEND_API + 'joinedItems/joinedExpenseCategories', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_JOINED_CATEGORIES' ,response.data.data);
}

export async function deleteCategory({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'expenseCategories/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getCategories');
}

//Sub-Categories

export async function getSubCategories({commit}) {
    let response = await axios.get(process.env.OC_BACKEND_API + 'expenseSubCategories', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_SUB_CATEGORIES' ,response.data.data);
}

export async function addSubCategory({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'expenseSubCategories/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getCategories');
}

export async function editSubCategory({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'expenseSubCategories/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getCategories')
}

export async function deleteSubCategory({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'expenseSubCategories/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getCategories')
}

// Suppliers

export async function getSuppliers({commit}) {
    let response = await axios.get(process.env.OC_BACKEND_API + 'suppliers', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_SUPPLIERS' ,response.data.data);
}

export async function createSupplier({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'suppliers/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getSuppliers');
}

export async function updateSupplier({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'suppliers/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getSuppliers');
}

export async function deleteSupplier({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'suppliers/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getSuppliers');
}

// Payment methods

export async function getPaymentMethods({commit}) {
    let response = await axios.get(process.env.OC_BACKEND_API + 'paymentMethods', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_PAYMENT_METHODS' ,response.data.data);
}

export async function addPaymentMethod({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'paymentMethods/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getPaymentMethods');
}

export async function updatePaymentMethod({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'paymentMethods/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getPaymentMethods');
}

export async function deletePaymentMethod({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'paymentMethods/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getPaymentMethods');
}

// Expenses

export async function getExpenses({commit}) {
    let response = await axios.get(process.env.OC_BACKEND_API + 'expenses', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_EXPENSES' ,response.data.data);
}

export async function getExpense({commit},id) {
    let response = await axios.get(process.env.OC_BACKEND_API + `expenses/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_EXPENSE' ,response.data.data)
}

export async function addExpense({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'expenses/create', payload.invoice, {headers: {Authorization: localStorage.getItem('accessToken')}});
    let data = new FormData();
    data.append('id', response.data.data.id);
    data.append('files', payload.file);
    await dispatch('addExpenseFile', data);
    await dispatch('getExpenses');
}

export async function addExpenseFile({dispatch}, payload) {
    try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'expenses/addFile', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    }catch(e) {
        console.log(e.response);
    }
    await dispatch('getExpenses');
}

export async function replaceExpenseFile({dispatch}, payload) {
    try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'expenses/replaceFiles', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    console.log(response)
    }catch(e) {
        console.log(e.response);
    }
    await dispatch('getExpenses');
}

export async function editExpense({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'expenses/update', payload.invoice, {headers: {Authorization: localStorage.getItem('accessToken')}});
    let data = new FormData();
    data.append('id', payload.invoice.id);
    data.append('files', payload.file);
    await dispatch('addExpenseFile', data);
    await dispatch('getExpenses');
}

export async function deleteExpense({dispatch}, payload) {
    let response = await axios.post(process.env.OC_BACKEND_API + 'expenses/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getExpenses');
}