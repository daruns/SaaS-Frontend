export function GET_EMPLOYEES (state, payload) {
  Object.assign(state.allEmployees, payload.res);
}

export function GET_DEPARTMENTS (state, payload) {
  Object.assign(state.departments, payload.res);
}

export function GET_LEAVE_TYPES (state, payload) {
  Object.assign(state.leaveTypes, payload.res);
}

export function GET_OVERTIME_TYPES (state, payload) {
  Object.assign(state.overtimeTypes, payload.res);
}

export function GET_DESIGNATIONS (state, payload) {
  Object.assign(state.designations, payload.res);
}

export function GET_ATTENDANCES (state, payload) {
  Object.assign(state.attendances, payload.res);
}

export function GET_MY_ATTENDANCES (state, payload) {
  Object.assign(state.myAttendances, payload.res);
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

export function GET_OVERTIME_TYPE (state, payload) {
  state.curentOvertimeType = payload ;
}

export function GET_DESIGNATION (state, payload) {
  state.currentDesignation = payload ;
}

export function GET_LEAVES (state, payload) {
  state.leaves = payload.res;
}
export function GET_LEAVE_APPROVALS (state, payload) {
  state.leaveApprovals = payload.res ;
}

export function GET_OVERTIMES (state, payload) {
  state.overtimes = payload.res;
}
export function GET_OVERTIME_APPROVALS (state, payload) {
  state.overtimeApprovals = payload.res ;
}

export function GET_LEAVE (state, payload) {
  state.currenLeave = payload ;
}

export function GET_MY_LEAVES (state, payload) {
  state.myLeaves = payload.res ;
}

export function GET_OVERTIME (state, payload) {
  state.currenOvertime = payload ;
}

export function GET_MY_OVERTIMES (state, payload) {
  state.myOvertimes = payload.res ;
}

export function GET_MY_EMPLOYEE (state,payload) {
  state.myEmployee = payload
}