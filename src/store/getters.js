export default {
    getProviderLoggedIn (state) {
      return state.providerEnabled
    },
    getWeb3 (state) {
      return state.web3
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