import axios from "axios";

// Invoice

export async function getInvoices({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/invoices', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_INVOICES' ,response.data.data)
}

export async function getInvoice({commit},id) {
    let response = await axios.get(`https://onconnect-backend-api.herokuapp.com/api/v1/invoices/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_INVOICE' ,response.data.data)
}

export async function addInvoice({commit, dispatch}, payload) {
    console.log(payload)
    try{
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/invoices/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    console.log(response);
    }catch(e) {
        console.log(e.response);
    }
    await dispatch('getInvoices');
}

export async function editInvoice({commit, dispatch}, payload) {
    console.log(payload)
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/invoices/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    console.log(response)
    await dispatch('getInvoices');
}

export async function deleteInvoice({commit, dispatch}, id) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/invoices/delete', {id: id}, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getInvoices');
}


// Quote

export async function getQuotes({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/quotes', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_QUOTES' ,response.data.data)
}

export async function getQuote({commit},id) {
    let response = await axios.get(`https://onconnect-backend-api.herokuapp.com/api/v1/quotes/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_QUOTE' ,response.data.data)
}

export async function addQuote({commit, dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/quotes/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getQuotes');
}

export async function editQuote({commit, dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/quotes/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getQuotes');
}

export async function deleteQuote({commit, dispatch}, id) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/quotes/delete', {id: id}, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getQuotes');
}


// Tax

export async function getTaxes({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/taxes', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_TAXES' ,response.data.data);
}

export async function deleteTax({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/taxes/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getTaxes');
}

// Categories

export async function getCategories({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/expenseCategories', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_CATEGORIES' ,response.data.data);
}

export async function getJoinedCategories({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/joinedItems/joinedExpenseCategories', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_JOINED_CATEGORIES' ,response.data.data);
}

export async function deleteCategory({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/expenseCategories/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getCategories');
}

//Sub-Categories

export async function getSubCategories({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/expenseSubCategories', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_SUB_CATEGORIES' ,response.data.data);
}

export async function addSubCategory({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/expenseSubCategories/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getCategories');
}

export async function editSubCategory({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/expenseSubCategories/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getCategories')
}

export async function deleteSubCategory({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/expenseSubCategories/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getCategories')
}

// Suppliers

export async function getSuppliers({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/suppliers', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_SUPPLIERS' ,response.data.data);
}

export async function createSupplier({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/suppliers/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getSuppliers');
}

export async function updateSupplier({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/suppliers/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getSuppliers');
}

export async function deleteSupplier({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/suppliers/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getSuppliers');
}

// Payment methods

export async function getPaymentMethods({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/paymentMethods', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_PAYMENT_METHODS' ,response.data.data);
}

export async function addPaymentMethod({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/paymentMethods/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getPaymentMethods');
}

export async function updatePaymentMethod({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/paymentMethods/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getPaymentMethods');
}

export async function deletePaymentMethod({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/paymentMethods/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getPaymentMethods');
}

// Expenses

export async function getExpenses({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/expenses', {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_EXPENSES' ,response.data.data);
}

export async function getExpense({commit},id) {
    let response = await axios.get(`https://onconnect-backend-api.herokuapp.com/api/v1/expenses/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_EXPENSE' ,response.data.data)
}

export async function addExpense({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/expenses/create', payload.invoice, {headers: {Authorization: localStorage.getItem('accessToken')}});
    let data = new FormData();
    data.append('id', response.data.data.id);
    data.append('files', payload.file);
    await dispatch('addExpenseFile', data);
    await dispatch('getExpenses');
}

export async function addExpenseFile({dispatch}, payload) {
    try{
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/expenses/addFile', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    }catch(e) {
        console.log(e.response);
    }
    await dispatch('getExpenses');
}

export async function replaceExpenseFile({dispatch}, payload) {
    try{
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/expenses/replaceFiles', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    console.log(response)
    }catch(e) {
        console.log(e.response);
    }
    await dispatch('getExpenses');
}

export async function editExpense({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/expenses/update', payload.invoice, {headers: {Authorization: localStorage.getItem('accessToken')}});
    let data = new FormData();
    data.append('id', payload.invoice.id);
    data.append('files', payload.file);
    await dispatch('addExpenseFile', data);
    await dispatch('getExpenses');
}

export async function deleteExpense({dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/expenses/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getExpenses');
}