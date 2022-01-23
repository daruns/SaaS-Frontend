import axios from "axios";
import { Notify } from 'quasar';
const env = "pro"
// const env = "dev"
const apiUrl = process.env.OC_BACKEND_API

//Drafts
export async function getPosts({commit}) {
  let response = await axios.get(apiUrl + 'socialMediaStudios/', {headers: {Authorization: localStorage.getItem('accessToken')}})
  commit('GET_POSTS' ,{ res: response.data.data})
  commit('GET_REJECTEDS' ,{ res: response.data.data})
}

export async function getDrafts({commit, dispatch}, id) {
  let response = await axios.get(apiUrl + `socialMediaStudios/drafts`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_DRAFTS', response.data.data);
}

export async function getProductions({commit, dispatch}, id) {
  let response = await axios.get(apiUrl + `socialMediaStudios/productions`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_PRODUCTIONS', response.data.data);
}

export async function getReviews({commit, dispatch}, id) {
  let response = await axios.get(apiUrl + `socialMediaStudios/reviews`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_REVIEWS', response.data.data);
}

export async function getCompleteds({commit, dispatch}, id) {
  let response = await axios.get(apiUrl + `socialMediaStudios/completeds`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_COMPLETEDS', response.data.data);
}
export async function getRejecteds({commit, dispatch}, id) {
  await dispatch('getPosts');
}

export async function getOnePost({commit, dispatch}, id) {
  let response = await axios.get(apiUrl + `socialMediaStudios/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_POST', response.data.data);
}

export async function createPost({commit, dispatch}, body) {
  let response = await axios.post(apiUrl + 'socialMediaStudios/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  console.log("response creating post: ", response)
  await dispatch('getPosts');
  if (response.res && response.res.id) {
    await dispatch('getPosts');
  }
}

export async function addUsersToPost({commit, dispatch}, body) {
  let response = await axios.post(apiUrl + 'socialMediaStudios/addUsers', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  console.log("response creating post: ", response)
  await dispatch('getPosts');
  return response
}

export async function removeUserFromPost({commit, dispatch}, body) {
  let response = await axios.post(apiUrl + 'socialMediaStudios/removeUsers', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  console.log("response creating post: ", response)
  await dispatch('getPosts');
}

export async function updatePost({commit, dispatch}, body) {
  try{
  let response = await axios.post(apiUrl + 'socialMediaStudios/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    console.log(e.response)
  }
  await dispatch('getPosts');
}

export async function deletePost({commit, dispatch}, body) {
  try{
  let response = await axios.post(apiUrl + 'socialMediaStudios/delete', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getPosts');
  }catch(e) {
    if(e.response.data.message === 'Invalid url!'){
      Notify.create({
        type: 'warning',
        message: 'This Post has pending operations!',
        textColor: 'white'
      })
    }
  }
}

// //Post Media
export async function createPostMedia({commit, dispatch}, body) {
  let response = await axios.post(apiUrl + 'socialMediaStudios/createMedia', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  console.log("response creating post: ", response)
  await dispatch('getPosts');
}

export async function addFileToMedia({commit, dispatch}, body) {
  let response = await axios.post(apiUrl + 'socialMediaStudios/addFile', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  console.log("response creating post: ", response)
  await dispatch('getPosts');
}

export async function removeFileToMedia({commit, dispatch}, body) {
  let response = await axios.post(apiUrl + 'socialMediaStudios/removeFile', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  console.log("response creating post: ", response)
  await dispatch('getPosts');
}

// //Draft Contact Persons

// export async function deleteContact({commit, dispatch},payload) {
//     let response = await axios.post(apiUrl + `clientContacts/delete`, {id: Number(payload.id)}, {headers: {Authorization: localStorage.getItem('accessToken')}});
//     await dispatch('getOneDraft',payload.clientId);
// }

// //Draft Meetings

// export async function getDraftMeetings({commit, dispatch}, id) {
//     let response = await axios.get(apiUrl + `socialMediaStudios/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}});
//     await commit('GET_CLIENT_MEETINGS' , response.data.data.meetings);
// }

// export async function removeMeeting({commit, dispatch}, body) {
//     let response = await axios.post(apiUrl + 'meetings/delete', {id: body.id}, {headers: {Authorization: localStorage.getItem('accessToken')}})
//     await dispatch('getDraftMeetings',body.clientId);
// }

// //Draft Social Media Links

// export async function deleteSocial({commit, dispatch},payload) {
//     let response = await axios.post(apiUrl + 'socialMedias/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}});
//     await dispatch('getOneDraft',payload.clientId);
// }

// export async function addSocial({commit, dispatch}, body) {
//     let response = await axios.post(apiUrl + 'socialMedias/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
//     await dispatch('getOneDraft', body.clientId);
// }

// export async function editSocial({commit, dispatch}, body) {
//     let response = await axios.post(apiUrl + 'socialMedias/update', body.data, {headers: {Authorization: localStorage.getItem('accessToken')}})
//     await dispatch('getOneDraft', body.clientId);
// }