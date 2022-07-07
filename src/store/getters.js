export default {
    getProviderLoggedIn (state) {
      return state.providerEnabled
    },
    getWeb3 (state) {
      return state.web3
    },
    getPass(state) {
      return state.hasPass
    },
    getCurrentPass(state) {
      return state.currentPass
    },
    getPassList(state) {
      return state.passList
    },
    getWrongNetworkMessage (state) {
      return state.wrongNetworkMessage
    },
    getAccount(state) {
      return state.account
    },
    getBalance(state) {
      return state.balance
    }
  }