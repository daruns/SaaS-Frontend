import axios from "axios";

// Inventory Items

export async function getUsers({commit}) {
    let response = await axios.get(process.env.OC_BACKEND_API + 'users/allWithBrand', {headers: {Authorization: localStorage.getItem('accessToken')}})
    commit('GET_USERS' ,response.data.data)
}

export async function deleteUser({dispatch}, payload) {
    try {
    let response = await axios.post(process.env.OC_BACKEND_API + 'users/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    }catch(e) {
        console.log(e.response)
    }
    dispatch('getUsers');
}

export async function createPermission({dispatch}, payload) {
    try {
    let response = await axios.post(process.env.OC_BACKEND_API + 'users/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    }catch(e) {
        console.log(e.response)
    }
    dispatch('getUsers');
}
