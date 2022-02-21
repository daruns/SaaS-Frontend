export function GET_POSTS (state, payload) {
  let drafts = [];
  let productions = [];
  let reviews = [];
  let completeds = [];
  let rejecteds = [];

  for (let i = payload.res.length-1; i>-1; i--) {
    if (payload.res[i].stage === 'draft') {
      drafts.push(payload.res[i])
    }
  }
  for (let i = payload.res.length-1; i>-1; i--) {
    if (payload.res[i].stage === 'production') {
      productions.push(payload.res[i])
    }
  }
  for (let i = payload.res.length-1; i>-1; i--) {
    if (payload.res[i].stage === 'review') {
      reviews.push(payload.res[i])
    }
  }
  for (let i = payload.res.length-1; i>-1; i--) {
    if (payload.res[i].stage === 'completed') {
      completeds.push(payload.res[i])
    }
  }
  for (let i = payload.res.length-1; i>-1; i--) {
    if (payload.res[i].status === 'rejected') {
      rejecteds.push(payload.res[i])
    }
  }
  Object.assign(state.allPosts, payload.res);
  Object.assign(state.drafts, drafts);
  Object.assign(state.productions, productions);
  Object.assign(state.reviews, reviews);
  Object.assign(state.completeds, completeds);
  Object.assign(state.rejecteds, rejecteds);
}

export function GET_POST (state, payload) {
  Object.assign(state.currentPost, payload.res);
}

export function GET_DRAFTS (state, payload) {
  Object.assign(state.drafts, payload.res);
}

export function GET_REVIEWS (state, payload) {
  Object.assign(state.reviews, payload.res);
}

export function GET_PRODUCTIONS (state, payload) {
  Object.assign(state.productions, payload.res);
}

export function GET_COMPLETEDS (state, payload) {
  Object.assign(state.completeds, payload.res);
}

export function GET_REJECTEDS (state, payload) {
  let rejecteds = [];
  for (let i = payload.res.length-1; i>-1; i--) {
    if (payload.res[i].status === 'rejected') {
      rejecteds.push(payload.res[i])
    }
  }

  Object.assign(state.rejecteds, rejecteds);
}
