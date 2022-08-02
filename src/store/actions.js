import { AccessCardNFT } from '../abis/AccessCardNFT.js'
// import { PolyVentureItems } from '../abis/PolyVentureItems'

export default {
    async getBalance({commit, getters}, account) {
        let web3 = getters.getWeb3;
        let balanceWei = await web3.eth.getBalance(account)
        let balanceEth = web3.utils.fromWei(balanceWei);
        return commit("setBalance", balanceEth)
    },

    // async getItems({commit, getters}, account) {
    //     // let res = false;
    //     // let web3 = getters.getWeb3;
    //     // let itemContract = await new web3.eth.Contract(PolyVentureItems, "0x4aBf50132a6d56d8090fC954953BF31bC1cc5dD9");

    // },

    async getPass({commit, getters}, account) {
        // get result from pass call 
        let res = false;
        let web3 = getters.getWeb3;
        let nftContract = await new web3.eth.Contract(AccessCardNFT, "0xE5e3276A037490064F9092B5502f7b059263A320");
        const balance = await nftContract.methods.balanceOf(account).call()
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