export function GET_USERS (state, payload) {
  state.users = []
for(let i = 0; i<payload.length; i++) { 
  if(payload[i].userType !== 'partner')
  state.users.push(payload[i])
}
}

export function RAISE_ERROR (state, payload) {
state.userError = payload
}