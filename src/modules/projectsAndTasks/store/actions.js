import axios from "axios";

// Projects

export async function getProjects({commit}) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'projects', {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_PROJECTS' ,response.data.data);
}

export async function addProject({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'projects/create', payload.data, {headers: {Authorization: localStorage.getItem('accessToken')}});
  await dispatch('getProjects');
  if(payload.files){
      console.log(response.data.data.id)
  let data = new FormData();
  data.append('id', response.data.data.id);
  data.append('files', payload.files);
  await dispatch('addFiles', data);
  await dispatch('getProjects');
  }

}

export async function addFiles({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'projects/addFile', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
  console.log(response);
}

export async function replaceFiles({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'projects/replaceFiles', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
}

export async function editProject({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'projects/update', payload.data, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getProjects');
}

export async function deleteProject({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'projects/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getProjects');
}

export async function addProjectMember({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'projects/addTeamMembers', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getProjects');
}

export async function deleteProjectMember({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'projects/removeTeamMembers', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getProjects');
}

export async function addProjectLeader({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'projects/addTeamLeaders', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getProjects');
}

export async function deleteProjectLeader({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'projects/removeTeamLeaders', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getProjects');
}

//Boards

export async function addBoard({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'boards/create', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
}

export async function editBoard({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'boards/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
}

export async function deleteBoard({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'boards/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
}

//Tasks

export async function addTask({dispatch}, payload) {
  if (payload.data.files) {
    delete payload.data.files
  }
  let response = await axios.post(process.env.OC_BACKEND_API + 'tasks/create', payload.data, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getProjects');
  if(payload.files){
    console.log(response.data.data.id)
    let data = new FormData();
    data.append('id', response.data.data.id);
    data.append('files', payload.files);
    await dispatch('addTaskFiles', data);
    await dispatch('getProjects');
  }
}

export async function addTaskFiles({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'tasks/addFile', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
  console.log(response);
}

export async function editTask({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'tasks/update', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
  if(payload.files){
    let data = new FormData();
    data.append('id', payload.id);
    data.append('files', payload.files);
    await dispatch('addTaskFiles', data);
  }
  await dispatch('getProjects');
}

export async function deleteTask({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'tasks/delete', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
}

export async function deleteMember({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'tasks/removeTeamMembers', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
}

export async function addMembers({dispatch}, payload) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'tasks/addTeamMembers', payload, {headers: {Authorization: localStorage.getItem('accessToken')}})
}