export async function getRooms({commit}, payload) {
    commit('GET_ROOMS', payload)
}

export async function getChat({commit}, payload) {
    commit('GET_CHAT', payload)
}

export async function clearChat({commit}) {
    commit('CLEAR_CHAT')
}


export async function getMessage({commit}, payload) {
    commit('GET_MESSAGE', payload)
}