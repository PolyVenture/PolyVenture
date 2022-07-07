
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import VuexPersistence from 'vuex-persist'



const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    reducer: state => ({
        referredByTag: state.referredByTag
    })
})

export const store = new Vuex.Store({
    state: {
        web3: null,
        account: "",
        hasPass: false,
        passList: [],
        balance: 0,
        currentPass: 0,
        wrongNetworkMessage: '',
    },
    getters,
    mutations,
    actions,
    plugins: [vuexLocal.plugin]
  })