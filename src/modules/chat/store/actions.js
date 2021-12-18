export async function getRooms({commit}, payload) {
    commit('GET_ROOMS', payload)
}

export async function getChat({commit}, payload) {
    commit('GET_CHAT', payload)
    console.log(payload)
}

export async function getMessage({commit}, payload) {
    commit('GET_MESSAGE', payload)
}