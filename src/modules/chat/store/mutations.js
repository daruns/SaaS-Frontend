export function GET_ROOMS (state, payload) {
    state.rooms = payload;
}

export function GET_CHAT (state, payload) {
    state.chat = []
    state.chat = payload;
}

export function CLEAR_CHAT (state) {
    state.chat = []
}

export function GET_MESSAGE (state, payload) {
    state.chat.messages.push({...payload});
}
