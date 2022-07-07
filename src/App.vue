<template>
<!-- <p class="warn-mess" v-if="wrongNetworkMessage.length > 0">{{wrongNetworkMessage}}</p> -->
  <router-view></router-view>
</template>

<script>

import { mapGetters } from "vuex";

export default {
  name: 'App',
  components: {
  },
    computed: {
    ...mapGetters({
      getProviderLoggedIn: "getProviderLoggedIn",
      web3store: "getWeb3",
      account: "getAccount",
      wrongNetworkMessage: "getWrongNetworkMessage"
    })
  },
    watch: {
    account() {
      this.$store.dispatch("getBalance", this.account);
    }
  },
    methods: {
    async getAccounts() {
      let accounts = await this.web3store.eth.getAccounts();
      this.$store.commit("setAccount", accounts[0]);
      this.$store.dispatch("getBalance", this.account);
      this.$store.dispatch("getPass", this.account, this.web3store);
      this.getBalance = () => {
        this.$store.dispatch("getBalance", this.account);
        setTimeout(() => {
          this.getBalance();
        }, 10000);
      };
    }
    },
  async created() {
    if (!window.web3 || !window.ethereum) {
      // redirect when no provider can be loaded
      if (window.location.pathname != "/getwallet")
        window.location.replace("/getwallet");
    } else if (window.ethereum) {
      // new provider system
      let ethereum = window.ethereum;
      let web3 = new window.Web3(ethereum);
      this.$store.commit("setWeb3", web3);
      console.log("ONE")
      this.getAccounts();
      window.ethereum.on('accountsChanged', () => {
        console.log("accountchange")
       this.getAccounts()
      })
      window.ethereum.on('disconnect', () => {
        console.log("disconnect")
       this.getAccounts()
      })
    } else if (window.web3) {
      // legacy provider system
            console.log("TWO")
      let web3 = new window.Web3(window.web3.currentProvider);
      this.$store.commit("setWeb3", web3);

      window.ethereum.on('accountsChanged', () => {
       this.getAccounts()
      })
      window.ethereum.on('disconnect', () => {
       this.getAccounts()
      })
      this.getAccounts();
    }
  }
    }

</script>

<style>

.warn-mess {
      position: fixed;
    color: white;
    z-index: 2;
    bottom: 70px;
    font-weight: 800;
    padding-left: 200px;
    padding-right: 200px;
}
html, body {
  margin: 0!important;
  padding: 0!important;
  background-color: black;
  min-height: 100vh;

}
#app {
  margin-top: -50px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: white;
  min-height: 100vh;
}
</style>
