export function GET_PAYSLIPS (state, payload) {
  Object.assign(state.payslips, payload.res);
}

export function GET_EARNING_TYPES (state, payload) {
  Object.assign(state.earningTypes, payload.res);
}

export function GET_DEDUCTION_TYPES (state, payload) {
  Object.assign(state.deductionTypes, payload.res);
}

export function GET_PAYSLIP (state, payload) {
  state.currentPayslip = payload ;
}

export function GET_EARNING_TYPE (state, payload) {
  state.curentEarningType = payload ;
}

export function GET_DEDUCTION_TYPE (state, payload) {
  state.curentDeductionType = payload ;
}

export function GET_EARNINGS (state, payload) {
  state.earnings = payload.res;
}

export function GET_DEDUCTIONS (state, payload) {
  state.deductions = payload.res;
}

export function GET_EARNING (state, payload) {
  state.currenEarning = payload ;
}

export function GET_DEDUCTION (state, payload) {
  state.currenDeduction = payload ;
}
