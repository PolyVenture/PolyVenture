export default {
async setWeb3(state, web3) {
    state.web3 = web3
    const checkNetwork = async (web3) => {
        let network = "80001"
        let con = await web3.eth.net.getId();
        if(con != network)  {
            state.wrongNetworkMessage = `WARNING: You are connected to the wrong network. You will not be able to interact with the platform properly until you switch to Polygon. `
        }
        else {
            state.wrongNetworkMessage = ''
        }
    }

    checkNetwork(web3)

    window.ethereum.on('networkChanged', function(){
       checkNetwork(web3)
      });


    // web3.currentProvider.publicConfigStore.on('update', function(res, err) {
    //     if(res.selectedAddress) {
    //         state.account = res.selectedAddress
    //     }
    //     if(err) console.log(err)
    // });
},

setPass(state, passStatus) {
    state.hasPass = passStatus
},

setCurrentPass(state, idx) {
    state.currentPass = idx
},

setPassList(state, list) {
    state.passList = list
},

setAccount(state, account) {
    state.account = account
},
setBalance(state, newBalance) {
    state.balance = newBalance
}

}

