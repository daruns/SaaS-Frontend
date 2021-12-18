export function GET_CLIENTS (state, payload) {

        let clients = [];
        let leads = [];
        let blacklist = [];
      

        for(let i = payload.res.length-1; i>-1; i--) {
        if(payload.res[i].clientType === 'client') {
          clients.push(payload.res[i])
        }
        else if(payload.res[i].clientType === 'lead') {
          leads.push(payload.res[i])
        }
        else if(payload.res[i].clientType === 'blacklist') {
          blacklist.push(payload.res[i])
        }
      }
      
       Object.assign(state.allClients, payload.res);
      state.clients = clients
      state.leads = leads
      state.blacklist = blacklist
}

export function GET_CLIENT (state, payload) {
  state.currentClient = payload ;
  state.clientContacts = payload.clientContacts
  state.clientSocialLinks = payload.socialMedias
}


export function GET_CLIENT_MEETINGS (state, payload) {
  state.clientMeetings = payload.reverse();
}