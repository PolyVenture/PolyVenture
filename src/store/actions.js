import { AccessCardNFT } from '../abis/AccessCardNFT.js'
export default {
    async getBalance({commit, getters}, account) {
        let web3 = getters.getWeb3;
        let balanceWei = await web3.eth.getBalance(account)
        let balanceEth = web3.utils.fromWei(balanceWei);
        return commit("setBalance", balanceEth)
    },

    async getPass({commit, getters}, account) {
        // get result from pass call 
        let res = false;
        let web3 = getters.getWeb3;
        console.log("1")
        let nftContract = await new web3.eth.Contract(AccessCardNFT, "0xB986eD3582641F91dD55947FA977244817584F49");
        console.log("2")
        const balance = await nftContract.methods.balanceOf(account).call()
        balance > 0 ? res = true : res = false
        commit("setPass", res)

        let promiseArray = []
        console.log(balance)
        console.log("3")

        for(let i=0; i < balance; i++) {
            promiseArray.push( await nftContract.methods.tokenOfOwnerByIndex(account, i).call())
        }

        Promise.all(promiseArray).then(r => {
            commit("setPassList", r)
        })

        return 
    }
}