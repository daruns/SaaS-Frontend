export function GET_ROOMS (state, payload) {
    state.rooms = payload;
}

export function GET_CHAT (state, payload) {
    state.chat = payload;
}

export function GET_MESSAGE (state, payload) {
    state.chat.messages.push({...payload});
}
