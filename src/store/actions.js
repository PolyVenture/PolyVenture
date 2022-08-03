import { AccessCardNFT } from '../abis/AccessCardNFT.js'
// import { PolyVentureItems } from '../abis/PolyVentureItems'

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
        let nftContract = await new web3.eth.Contract(AccessCardNFT, "0xfC5aC5510D2834DC31884C8d6F6aFB1f7753Ee6c");
        const balance = await nftContract.methods.balanceOf(account).call()
        console.log(balance)
        balance > 0 ? res = true : res = false
        commit("setPass", res)

        let promiseArray = []

        for(let i=0; i < balance; i++) {
            promiseArray.push( await nftContract.methods.tokenOfOwnerByIndex(account, i).call())
        }

        Promise.all(promiseArray).then(r => {
            commit("setPassList", r)
        })

        return 
    }
}