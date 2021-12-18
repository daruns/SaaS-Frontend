import axios from "axios";
import { Notify } from 'quasar';

//Clients

export async function getClients({commit}, type) {
    let response = await axios.get('https://onconnect-backend-api.herokuapp.com/api/v1/clients', {headers: {Authorization: localStorage.getItem('accessToken')}})
    commit('GET_CLIENTS' ,{type: type, res: response.data.data})
}

export async function getOneClient({commit, dispatch}, id) {
    let response = await axios.get(`https://onconnect-backend-api.herokuapp.com/api/v1/clients/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await commit('GET_CLIENT', response.data.data);
}

export async function createClient({commit, dispatch}, body) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/clients/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getClients');
}

export async function updateClient({commit, dispatch}, body) {
    try{
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/clients/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
    }catch(e) {
        console.log(e.response)
    }
    await dispatch('getClients');
}

export async function deleteClient({commit, dispatch}, body) {
    try{
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/clients/delete', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getClients');
    }catch(e) {
        if(e.response.data.message === 'Invalid url!'){
            Notify.create({
                type: 'warning',
                message: 'This client has pending operations!',
                textColor: 'white'
              })
        }
    }
}

//Client Contact Persons

export async function deleteContact({commit, dispatch},payload) {
    let response = await axios.post(`https://onconnect-backend-api.herokuapp.com/api/v1/clientContacts/delete`, {id: Number(payload.id)}, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getOneClient',payload.clientId);
}

//Client Meetings

export async function getClientMeetings({commit, dispatch}, id) {
    let response = await axios.get(`https://onconnect-backend-api.herokuapp.com/api/v1/clients/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await commit('GET_CLIENT_MEETINGS' , response.data.data.meetings);
}

export async function removeMeeting({commit, dispatch}, body) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/meetings/delete', {id: body.id}, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getClientMeetings',body.clientId);
}

//Client Social Media Links

export async function deleteSocial({commit, dispatch},payload) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/socialMedias/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
    await dispatch('getOneClient',payload.clientId);
}

export async function addSocial({commit, dispatch}, body) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/socialMedias/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getOneClient', body.clientId);
}

export async function editSocial({commit, dispatch}, body) {
    let response = await axios.post('https://onconnect-backend-api.herokuapp.com/api/v1/socialMedias/update', body.data, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getOneClient', body.clientId);
}