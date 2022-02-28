export function GET_EMPLOYEES (state, payload) {
  Object.assign(state.allEmployees, payload.res);
}

export function GET_DEPARTMENTS (state, payload) {
  Object.assign(state.departments, payload.res);
}

export function GET_LEAVE_TYPES (state, payload) {
  Object.assign(state.leaveTypes, payload.res);
}

export function GET_DESIGNATIONS (state, payload) {
  Object.assign(state.designations, payload.res);
}

export function GET_ATTENDANCES (state, payload) {
  Object.assign(state.attendances, payload.res);
}

export function GET_EMPLOYEE (state, payload) {
  state.currentEmployee = payload ;
}

export function GET_DEPARTMENT (state, payload) {
  state.currentDepartment = payload ;
}

export function GET_LEAVE_TYPE (state, payload) {
  state.curentLeaveType = payload ;
}

export function GET_DESIGNATION (state, payload) {
  state.currentDesignation = payload ;
}
