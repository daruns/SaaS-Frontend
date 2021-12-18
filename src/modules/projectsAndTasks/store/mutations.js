export function GET_PROJECTS (state, payload) {
  state.projects = payload.reverse();
}
