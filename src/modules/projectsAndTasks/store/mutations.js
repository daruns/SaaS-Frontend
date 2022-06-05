export function GET_PROJECTS (state, payload) {
  state.projects = payload.reverse();
}

export function GET_PROJECT (state, payload) {
  state.project = payload;
}

export function GET_PROJECT_CLIENTS (state, payload) {
  state.allProjectClients = payload
}
export function GET_PROJECT_USERS (state, payload) {
  state.allProjectUsers = payload
}