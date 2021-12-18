export function GET_INVENTORY_ITEMS (state, payload) {
  state.inventoryItems = payload.reverse()
}

export function GET_NON_INVENTORY_ITEMS (state, payload) {
  state.nonInventoryItems = payload.reverse()
}

export function GET_SERVICE_ITEMS (state, payload) {
  let subServices = []

  for(let i = 0; i < payload.services.length; i++) {
    payload.services[i] = {
      ...payload.services[i],
      subServices: []
    }
  }

  for(let i = 0; i < payload.services.length; i++) {
    for(let j = 0; j<payload.subServices.length; j++) {
      if(payload.subServices[j].serviceItemId === payload.services[i].id){
         payload.services[i].subServices.push(payload.subServices[j]);
      }
    }
  }

  state.serviceItems = payload.services.reverse()
}

export function GET_JOINED_ITEMS (state, payload) {
  state.joinedItems = payload
}