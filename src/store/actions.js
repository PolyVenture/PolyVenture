export default {
    async getBalance({commit, getters}, account) {
        let web3 = getters.getWeb3;
        let balanceWei = await web3.eth.getBalance(account)
        let balanceEth = web3.utils.fromWei(balanceWei);
        return commit("setBalance", balanceEth)
    },
}