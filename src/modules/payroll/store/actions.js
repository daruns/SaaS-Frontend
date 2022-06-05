import axios from "axios";
import { Notify } from 'quasar';

//Clients

export async function getPayslips({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'payslips', {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_PAYSLIPS' ,{type: type, res: response.data.data})
}
export async function getEarnings({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'earnings', {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_EARNINGS' ,{type: type, res: response.data.data})
}
export async function getDeductions({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'deductions', {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_DEDUCTIONS' ,{type: type, res: response.data.data})
}
export async function getEarningTypes({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'earningTypes', {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_EARNING_TYPES' ,{type: type, res: response.data.data})
}
export async function getDeductionTypes({commit}, type) {
  let response = await axios.get(process.env.OC_BACKEND_API + 'deductionTypes', {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_DEDUCTION_TYPES' ,{type: type, res: response.data.data})
}
export async function getOnePayslip({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `payslips/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_PAYSLIP', response.data.data);
}
export async function getOneEarning({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `earnings/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_EARNING', response.data.data);
}
export async function getOneDeduction({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `deductions/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_DEDUCTION', response.data.data);
}

export async function getOneEarningType({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `earningTypes/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_EARNING_TYPE', response.data.data);
}

export async function getOneDeductionType({commit, dispatch}, id) {
  let response = await axios.get(process.env.OC_BACKEND_API + `deductionTypes/${id}`, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await commit('GET_DEDUCTION_TYPE', response.data.data);
}

export async function createPayslip({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'payslips/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getPayslips');
}

export async function createEarning({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'earnings/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getEarnings');
}

export async function createDeduction({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'deductions/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getDeductions');
}

export async function createEarningType({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'earningTypes/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getEarningTypes');
}

export async function createDeductionType({commit, dispatch}, body) {
  let response = await axios.post(process.env.OC_BACKEND_API + 'deductionTypes/create', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getDeductionTypes');
}

export async function updatePayslip({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'payslips/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
      console.log(e.response)
  }
  await dispatch('getPayslips');
}

export async function updateEarningType({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'earningTypes/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    console.log(e.response)
  }
  await dispatch('getEarningTypes');
}

export async function updateDeductionType({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'deductionTypes/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    console.log(e.response)
  }
  await dispatch('getDeductionTypes');
}

export async function updateEarning({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'earnings/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    console.log(e.response)
  }
  await dispatch('getEarnings');
}

export async function updateDeduction({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'deductions/update', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    console.log(e.response)
  }
  await dispatch('getDeductions');
}

export async function deletePayslip({commit, dispatch}, body) {
  try{
  let response = await axios.post(process.env.OC_BACKEND_API + 'payslips/delete', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getPayslips');
  }catch(e) {
    if(e.response.data.message === 'Invalid url!'){
      Notify.create({
        type: 'warning',
        message: 'Something went wrong!',
        textColor: 'white'
      })
    }
  }
}

export async function deleteEarning({commit, dispatch}, body) {
  try{
  let response = await axios.post(process.env.OC_BACKEND_API + 'earnings/delete', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getEarnings');
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

export async function deleteDeduction({commit, dispatch}, body) {
  try{
  let response = await axios.post(process.env.OC_BACKEND_API + 'deductions/delete', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  await dispatch('getDeductions');
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

export async function deleteEarningType({commit, dispatch}, body) {
  try{
  let response = await axios.post(process.env.OC_BACKEND_API + 'earningTypes/delete', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
  }catch(e) {
    if(e.response.data.message === 'Invalid url!'){
      Notify.create({
        type: 'warning',
        message: 'This earningType has pending operations!',
        textColor: 'white'
      })
    }
  }
  await dispatch('getEarningTypes');
}

export async function deleteDeductionType({commit, dispatch}, body) {
  try{
    let response = await axios.post(process.env.OC_BACKEND_API + 'deductionTypes/delete', body, {headers: {Authorization: localStorage.getItem('accessToken')}})
    await dispatch('getDeductionTypes');
  }catch(e) {
    if(e.response.data.message === 'Invalid url!'){
      Notify.create({
        type: 'warning',
        message: 'This deductionType has pending operations!',
        textColor: 'white'
      })
    } else {
      Notify.create({
        type: 'danger',
        message: `something went wrong while deleting deduction type! Error: ${e}`,
        textColor: 'white'
      })
    }
  }
}
