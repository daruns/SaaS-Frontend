import axios from "axios";

// Inventory Items

export async function getUsers({commit}) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/users/allWithBrand', {headers: {Authorization: localStorage.getItem('accessToken')}})
    commit('GET_USERS' ,response.data.data)
}

export async function deleteUser({dispatch}, payload) {
    try {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/users/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
    }catch(e) {
        console.log(e.response)
    }
    dispatch('getUsers');
}

