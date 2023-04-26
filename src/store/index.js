// import { createStore } from 'vuex'
//
// export default createStore({
//   state: {
//   },
//   getters: {
//   },
//   mutations: {
//   },
//   actions: {
//   },
//   modules: {
//   }
// })

import Store from 'electron-store'
const schema = {
    token: {
        type: "string",
        default: ""
    }
}
const store = new Store({schema})

export default store