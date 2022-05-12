import axios from "axios";
import { Notify } from 'quasar';

//Clients

export async function getEmployees({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'employees', {headers: {Authorization: localStorage.getItem('accessToken')}})
  commit('GET_EMPLOYEES' ,{type: type, res: response.data.data})
}
export async function getLeaves({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'leaves', {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_LEAVES' ,{type: type, res: response.data.data})
}
export async function getOvertimes({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'overtimes', {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_OVERTIMES' ,{type: type, res: response.data.data})
}
export async function getMyLeaves({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'leaves/myLeaves', {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_MY_LEAVES' ,{type: type, res: response.data.data})
}
export async function getMyOvertimes({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'overtimes/myOvertimes', {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_MY_OVERTIMES' ,{type: type, res: response.data.data})
}
export async function getLeaveApprovals({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'leaves/allApprovals', {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_LEAVE_APPROVALS' ,{type: type, res: response.data.data})
}
export async function getOvertimeApprovals({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'overtimes/allApprovals', {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_OVERTIME_APPROVALS' ,{type: type, res: response.data.data})
}
export async function getDepartments({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'departments', {headers: {Authorization: localStorage.getItem('accessToken')}})
  commit('GET_DEPARTMENTS' ,{type: type, res: response.data.data})
}
export async function getLeaveTypes({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'leaveTypes', {headers: {Authorization: localStorage.getItem('accessToken')}})
  commit('GET_LEAVE_TYPES' ,{type: type, res: response.data.data})
}
export async function getOvertimeTypes({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'overtimeTypes', {headers: {Authorization: localStorage.getItem('accessToken')}})
  commit('GET_OVERTIME_TYPES' ,{type: type, res: response.data.data})
}
export async function getDesignations({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'designations', {headers: {Authorization: localStorage.getItem('accessToken')}})
  commit('GET_DESIGNATIONS' ,{type: type, res: response.data.data})
}
export async function getAttendances({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'attendances', {headers: {Authorization: localStorage.getItem('accessToken')}})
  commit('GET_ATTENDANCES' ,{type: type, res: response.data.data})
}
export async function getMyAttendances({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'attendances/myAttendances', {headers: {Authorization: localStorage.getItem('accessToken')}})
  commit('GET_MY_ATTENDANCES' ,{type: type, res: response.data.data})
}

export async function getOneEmployee({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `employees/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_EMPLOYEE', response.data.data);
}

export async function getOneLeave({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `leaves/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_LEAVE', response.data.data);
}
export async function getOneOvertime({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `overtimes/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_OVERTIME', response.data.data);
}

export async function getMyEmployee({commit, dispatch}) {
  let response = await axios.get(process.env.OC_BACKEND_API + `employees/me`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_MY_EMPLOYEE', response.data.data);
}

export async function getOneDepartment({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `departments/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_DEPARTMENT', response.data.data);
}

export async function getOneLeaveType({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `leaveTypes/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_LEAVE_TYPE', response.data.data);
}

export async function getOneOvertimeType({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `overtimeTypes/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_OVERTIME_TYPE', response.data.data);
}

export async function getOneDesignation({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `designations/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_DESIGNATION', response.data.data);
}

export async function createEmployee({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'employees/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getEmployees');
}

export async function createLeave({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'leaves/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getLeaves');
  await dispatch('getLeaveApprovals');
  await dispatch('getMyLeaves');
}

export async function createOvertime({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'overtimes/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getOvertimes');
  await dispatch('getOvertimeApprovals');
  await dispatch('getMyOvertimes');
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

export async function createOvertimeType({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'overtimeTypes/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getOvertimeTypes');
}

export async function createDesignation({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'designations/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getDesignations');
}
export async function approveLeave({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'leaves/approveLeave', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    console.log(e.response)
  }
  await dispatch('getLeaves');
  await dispatch('getLeaveApprovals');
}

export async function approveOvertime({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'overtimes/approveOvertime', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    console.log(e.response)
  }
  await dispatch('getOvertimes');
  await dispatch('getOvertimeApprovals');
}

export async function updateApproval({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'overtimes/updateApproval', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
      console.log(e.response)
  }
  await dispatch('getOvertimes');
  await dispatch('getOvertimeApprovals');

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

export async function updateOvertimeType({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'overtimeTypes/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    console.log(e.response)
  }
  await dispatch('getOvertimeTypes');
}

export async function updateLeave({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'leaves/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    console.log(e.response)
  }
  await dispatch('getLeaves');
  await dispatch('getLeaveApprovals');
  await dispatch('getMyLeaves');
}

export async function updateOvertime({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'overtimes/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    console.log(e.response)
  }
  await dispatch('getOvertimes');
  await dispatch('getOvertimeApprovals');
  await dispatch('getMyOvertimes');
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
export async function deleteLeave({commit, dispatch}, body) {
  try{
  let response = await axios.post(process.env.OC_BACKEND_API + 'leaves/delete', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getLeaves');
  await dispatch('getLeaveApprovals');
  await dispatch('getMyLeaves');
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

export async function deleteOvertimeType({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'overtimeTypes/delete', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getOvertimeTypes');
  }catch(e) {
    if(e.response.data.message === 'Invalid url!'){
      Notify.create({
        type: 'warning',
        message: 'This overtimeType has pending operations!',
        textColor: 'white'
      })
    } else {
      Notify.create({
        type: 'danger',
        message: `something went wrong while deleting overtime type! Error: ${e}`,
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
