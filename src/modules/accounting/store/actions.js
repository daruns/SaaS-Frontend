import axios from "axios";

// Inventory Items

export async function getInventoryItems({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/inventoryItems', {headers: {Authorization: localStorage.getItem('accessToken')}})
    commit('GET_INVENTORY_ITEMS' ,response.data.data)
}

export async function addItem({commit, dispatch}, payload) {
    try{
    payload.qty = Number(payload.qty);
    console.log(payload)
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/inventoryItems/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    }catch(e) {
        console.log(e.response)
    }
    dispatch('getInventoryItems');
}

export async function editItem({commit, dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/inventoryItems/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    dispatch('getInventoryItems');
}

export async function delItem({commit, dispatch}, id) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/inventoryItems/delete', {id: id}, {headers: {Authorization: localStorage.getItem('accessToken')}})
    dispatch('getInventoryItems');
}


// Non Inventory Items

export async function getNonInventoryItems({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/nonInventoryItems', {headers: {Authorization: localStorage.getItem('accessToken')}})
    commit('GET_NON_INVENTORY_ITEMS' ,response.data.data)
}

export async function addNItem({commit, dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/nonInventoryItems/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    dispatch('getNonInventoryItems');
}

export async function editNItem({commit, dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/nonInventoryItems/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    dispatch('getNonInventoryItems');
}

export async function delNItem({commit, dispatch}, id) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/nonInventoryItems/delete', {id: id}, {headers: {Authorization: localStorage.getItem('accessToken')}})
    dispatch('getNonInventoryItems');
}


// Service items

export async function getServiceItems({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/serviceItems', {headers: {Authorization: localStorage.getItem('accessToken')}})
    let subServices = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/subServiceItems', {headers: {Authorization: localStorage.getItem('accessToken')}})
    await commit('GET_SERVICE_ITEMS' ,{services: response.data.data, subServices: subServices.data.data});
}

export async function addSItem({commit, dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/serviceItems/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    dispatch('getServiceItems');
}

export async function editSItem({commit, dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/serviceItems/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    dispatch('getServiceItems');
}

export async function delSItem({commit, dispatch}, id) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/serviceItems/delete', {id: id}, {headers: {Authorization: localStorage.getItem('accessToken')}})
    dispatch('getServiceItems');
}


// SUB service items

export async function addSubService({commit, dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/subServiceItems/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getServiceItems');
}

export async function editSubService({commit, dispatch}, payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/subServiceItems/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getServiceItems');
}

export async function deleteSubService({commit, dispatch}, id) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/subServiceItems/delete', {id: id}, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getServiceItems');
}

// Joined Items

export async function getJoinedItems({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/joinedItems', {headers: {Authorization: localStorage.getItem('accessToken')}})
    commit('GET_JOINED_ITEMS' ,response.data.data)
}