import axios from "axios";
import { Notify } from 'quasar';

//Clients

export async function getEmployees({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'employees', {headers: {Authorization: localStorage.getItem('accessToken')}})
  commit('GET_EMPLOYEES' ,{type: type, res: response.data.data})
}
export async function getDepartments({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'departments', {headers: {Authorization: localStorage.getItem('accessToken')}})
  commit('GET_DEPARTMENTS' ,{type: type, res: response.data.data})
}
export async function getLeaveTypes({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'leaveTypes', {headers: {Authorization: localStorage.getItem('accessToken')}})
  commit('GET_LEAVE_TYPES' ,{type: type, res: response.data.data})
}
export async function getDesignations({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'designations', {headers: {Authorization: localStorage.getItem('accessToken')}})
  commit('GET_DESIGNATIONS' ,{type: type, res: response.data.data})
}
export async function getAttendances({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'attendances', {headers: {Authorization: localStorage.getItem('accessToken')}})
  commit('GET_ATTENDANCES' ,{type: type, res: response.data.data})
}

export async function getOneEmployee({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `employees/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_EMPLOYEE', response.data.data);
}

export async function getOneDepartment({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `departments/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_DEPARTMENT', response.data.data);
}

export async function getOneLeaveType({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `leaveTypes/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_LEAVE_TYPE', response.data.data);
}

export async function getOneDesignation({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `designations/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_DESIGNATION', response.data.data);
}

export async function createEmployee({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'employees/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getEmployees');
}

export async function createDepartment({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'departments/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getDepartments');
}

export async function createAttendance({commit, dispatch}) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'attendances/create',{}, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getAttendances');
}

export async function createLeaveType({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'leaveTypes/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getLeaveTypes');
}

export async function createDesignation({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'designations/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getDesignations');
}

export async function updateEmployee({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'employees/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
      console.log(e.response)
  }
  await dispatch('getEmployees');
}

export async function updateDepartment({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'departments/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    console.log(e.response)
  }
  await dispatch('getDepartments');
}

export async function updateLeaveType({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'leaveTypes/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    console.log(e.response)
  }
  await dispatch('getLeaveTypes');
}

export async function updateDesignation({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'designations/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    console.log(e.response)
  }
  await dispatch('getDesignations');
}

export async function deleteEmployee({commit, dispatch}, body) {
  try{
  let response = await axios.post(process.env.OC_BACKEND_API + 'employees/delete', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getEmployees');
  }catch(e) {
    if(e.response.data.message === 'Invalid url!'){
      Notify.create({
        type: 'warning',
        message: 'This has pending operations!',
        textColor: 'white'
      })
    }
  }
}

export async function deleteDepartment({commit, dispatch}, body) {
  try{
  let response = await axios.post(process.env.OC_BACKEND_API + 'departments/delete', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getDepartments');
  }catch(e) {
    if(e.response.data.message === 'Invalid url!'){
      Notify.create({
        type: 'warning',
        message: 'This has pending operations!',
        textColor: 'white'
      })
    }
  }
}

export async function deleteLeaveType({commit, dispatch}, body) {
  try{
  let response = await axios.post(process.env.OC_BACKEND_API + 'leaveTypes/delete', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getLeaveTypes');
  }catch(e) {
    if(e.response.data.message === 'Invalid url!'){
      Notify.create({
        type: 'warning',
        message: 'This leaveType has pending operations!',
        textColor: 'white'
      })
    }
  }
}

export async function deleteDesignation({commit, dispatch}, body) {
  try{
  let response = await axios.post(process.env.OC_BACKEND_API + 'designations/delete', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getDesignations');
  }catch(e) {
    if(e.response.data.message === 'Invalid url!'){
      Notify.create({
        type: 'warning',
        message: 'This has pending operations!',
        textColor: 'white'
      })
    }
  }
}
