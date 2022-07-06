<template>
  <div class="main" @keyup.enter="handleEnterKey">
    <div class="container">
      <div class="col-md-4 col-md-offset-4">
        <div class="console">
           <div class="glitch" style="margin-top: 100px" v-if="!playpassEnabled" data-text="POLYVENTURE">POLYVENTURE</div>
           <div class="glitch" v-if="playpassEnabled" data-text="POLYVENTURE">POLYVENTURE</div>
            <div class="scanlines"></div>

            <div v-if="!playpassEnabled" style="position: relative; z-index: 2; width: 700px">
              <p>To play PolyVenture you need to obtain a PlayPass. During Alpha phase the PlayPass is free</p>

              <div v-if="wrongNetworkMessage.length > 0">
                <a class="btn btn-purchase" style="float: left; margin-right: 20px; width: 300px" @click="requestPolygon()">1) Switch to Polygon Network</a>
                <a class="btn btn-purchase disabled" style="float: left; width: 300px;">2) Mint a free PlayPass</a>
              </div>
              <div  v-if="wrongNetworkMessage.length === 0">
                <a class="btn btn-purchase">Mint a free PlayPass</a>
              </div>
            </div>

          <div class="con" v-if="playpassEnabled">
              <p>> INPUT "START" TO START THE GAME.</p>
              <p>> PRESS ENTER KEY TO RUN THE COMMAND</p>

              <div v-for="item in previousCommands" :key="item" style="width: 500px;">
                <p v-if="item.char === 'user'" style="text-transform:uppercase;">> {{item.message}}</p>
                <p v-if="item.char === 'sug'" style="color: white; text-transform:uppercase;">> {{item.message}}</p>
                <p v-if="item.char === 'computer'" class="anim-typewriter" style="height: 20px!important; max-height: 20px!important; overflow: hidden; color: rgb(235 0 255);font-weight: 800; opacity: 0; text-transform:uppercase;">{{item.message}}</p>
              </div>
              <div>
              <p class="cursor">></p>
              <input autofocus type="text" v-model="inputString" class="inp-cursor"  refs="cursi">
              </div>
          </div>            
        </div>
      </div>
    </div>
    <div class="backpack" v-if="backpackEnabled && playpassEnabled">
      <p class="bp-title">BACKPACK (1 item)</p>
       <div class="scroll" style="color: #E7E7E7; font-size: 12px; padding-top: 5px; color: #ffc107; text-align: center">owner: glassvault.eth</div>
      <div class="slot key__512" style="border-color: white" @click="openDetail('key__512')"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
      <div class="slot"></div>
    </div>


  <div class="item-detail" v-if="detailOpen">
      <div class="item-close" @click="closeDetail()">x</div>
      <div :class="loadedImage" style="width: 100%; height: 100%;"></div>
  </div>


  </div>

  
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'HomeComponent',
  props: {
    msg: String
  }, 
  data: function() {
    return {
      previousCommands: [],
      cur: "",
      playpassEnabled: true,
      inputString: "",
      currentStep: 1,
      backpackEnabled: false,
      detailOpen: false,
      loadedImage: ""
    }
  },
  computed: {
    ...mapGetters({
      getProviderLoggedIn: "getProviderLoggedIn",
      web3store: "getWeb3",
      account: "getAccount",
      wrongNetworkMessage: "getWrongNetworkMessage"
    })
  },
  methods: {
    goSetup: function() {
      this.$router.push("/setup")
    },

    async requestPolygon() {
        let chainId = 137
        if (window.ethereum.networkVersion !== chainId) {
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: this.web3store.utils.toHex(chainId) }]
              });
            } catch (err) {
                // This error code indicates that the chain has not been added to MetaMask
              if (err.code === 4902) {
                window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainName: 'Polygon Mainnet',
                      chainId: this.web3store.utils.toHex(chainId),
                      nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                      rpcUrls: ['https://polygon-rpc.com/']
                    }
                  ]
                }).then(() => console.log("done"))
                console.log("done")
                 this.$store.commit("setWeb3", this.web3store);
              }
            }
          }
    },

    checkpointManager: function() {

    },

    openDetail: function(itemTitle) {
      this.detailOpen = true;
      this.loadedImage = itemTitle
    },
    closeDetail: function() {
      this.detailOpen = false; 

    },

    delaySend: function(author, message, delay) {
      setTimeout(() => {
        this.previousCommands.push({char: author, message})
        }, delay)
    },
    // no checkpoint -> check for start
    // checkpoint 1 -> check for yes, open, ok (positive words)
    // checkpoint 2 -> 
    checkpoint1: function(input) {
      if(input === 'start') {
        this.previousCommands.push({char: 'computer', message: "you wake up on a beach.."})
        this.delaySend("computer", "there is a backpack on the sand", 4000)
        this.delaySend("computer", "open backpack?", 8000)
        this.currentStep++;
      }
    },
    checkpoint2: function(input) {
      if(input === 'open' || input === 'yes' || input === 'ok') {
        this.previousCommands.push({char: 'computer', message: "you open the backpack"})
        setTimeout(() => {this.backpackEnabled = true }, 4000)
        this.delaySend("computer", "the backpack contains a key", 4000)
        this.delaySend("user", "maybe I should give the key a closer look", 10000)
        this.delaySend("sug", "there are 2 paths leading away from the beach. The first road leads north towards a small town, the second road leads east towards a forest", 14000)
        this.currentStep++;
      }
    },
    handleEnterKey: function() {
      this.previousCommands.push({char: 'user', message: this.inputString})
      this["checkpoint" + this.currentStep](this.inputString.toLowerCase())
      this.inputString = ""
    }
  },
    mounted() {

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.backpack::-webkit-scrollbar {
  display: none;
}

.btn-purchase {
    border: none;
    border-radius: 0;
    background-color: #ff0cc7;
    border-bottom: 4px solid #97144d;
    color: white;
    float: left;
    cursor: pointer;

    &.disabled {
      background-color: grey;
      border-bottom: 4px solid #333;
    }
}
.scroll {
  position: fixed;
  background-color: #333;
  height: 30px;
  width: 300px;
  bottom: 40px;
  right: 40px;

}

.key__512 {
  background: url("../assets/key__512.png");
  background-size: cover;
}
.backpack {
  height: 310px; 
  width: 300px;
  position:fixed;
  padding-left: 8px;
  bottom: 40px;
  right: 40px;
  overflow: scroll;
  background-color: #151414;

  .bp-title {
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 0px;
    color: #2fff00; 
    font-family: 'Fira Mono';
  }
  .slot {
    background-color: black;
    margin: 5px;
    cursor: pointer;
    width: 85px;
    float: left;
    height: 85px;
  }
}
.title {
  color: white;
  margin-left: 0;
  text-align: left;

}

.inp-cursor {
  background-color: black; 
  border: none; 
  margin-left: 0; 
  float: left; 
  color: #2fff00; 
  font-family: 'Fira Mono';
  font-weight: 300;
  font-size: 17px;
  margin-left: -15px; 
  padding-left: 25px;
  text-transform:uppercase;
  border: none!important;
  cursor: none!important;
caret-color: black;
  &:focus {
    outline: none!important;
    border: none!important;
  }
  &:active {
          caret-color: transparent;
  }
}
.cursor{
  float: left;
    -webkit-animation: blink 1s step-end infinite;
  animation: blink 1s step-end infinite;
}
.con {
  position: absolute;
}
.input-window {
  width: 500px; 
  z-index: 20;
  height: 50px;
  border: 1px solid white;
}
.console {
  font-family: 'Fira Mono';
  font-weight: 300;
  font-size: 17px;
  p {
    color: #00de00;
  }
}

.subt {
  font-weight: 200;
  font-size: 20px;
  text-align: center;
}
.prim {
  color: white;
  font-size: 18px;
  margin: 20px;
  margin-top: 50px;
  margin-bottom: 50px;
}
.main {
  margin-top: 50px;
  color: #131722;
  min-height: 100vh;
  background-color: black;
  width: 100%;
  padding: 20px;
}

p {
  text-align: left;
  color: #131722;
}
ul {
  float: left;
  text-align: left;
  color: #131722;
}

h1 {
  color: #131722;
}

li {
  margin-left: 0!important;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.glitch {
  color: rgb(223, 191, 191);
  position: relative;
  font-size: 9vw;
  // margin: 70px 200px;
  animation: glitch 5s 5s infinite;
}

.glitch::before {
  content: attr(data-text);
  position: absolute;
  left: -2px;
  text-shadow: -5px 0 magenta;
  background: black;
  overflow: hidden;
  top: 0;
  animation: noise-1 3s linear infinite alternate-reverse, glitch 5s 5.05s infinite;
}

.glitch::after {
  content: attr(data-text);
  position: absolute;
  left: 2px;
  text-shadow: -5px 0 lightgreen;
  background: black;
  overflow: hidden;
  top: 0;
  animation: noise-2 3s linear infinite alternate-reverse, glitch 5s 5s infinite;
}

@keyframes glitch {
  1%{
    transform: rotateX(10deg) skewX(90deg);
  }
  2%{
    transform: rotateX(0deg) skewX(0deg);
  }
}

@keyframes noise-1 {
  $steps: 30;
  @for $i from 1 through $steps {
    #{percentage($i*(1/$steps))} {
      $top: random(100);
      $bottom: random(101 - $top);
      clip-path: inset(#{$top}px 0 #{$bottom}px 0);
    }
  }
}

@keyframes noise-2 {
  $steps: 30;
  @for $i from 0 through $steps {
    #{percentage($i*(1/$steps))} {
      $top: random(100);
      $bottom: random(101 - $top);
      clip-path: inset(#{$top}px 0 #{$bottom}px 0);
    }
  }
}

.scanlines {
  overflow: hidden;
  mix-blend-mode: difference;
}

.scanlines::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  background: repeating-linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.05) .5%,
    transparent 1%
  );

  animation: fudge 7s ease-in-out alternate infinite;
}


@keyframes fudge {
  from {
    transform: translate(0px, 0px);
  }
  to {
    transform: translate(0px, 2%);
  }
}

.glow {
  @extend .glitch;
  text-shadow: 0 0 1000px rgb(223, 191, 191);
  color: transparent;
  position: absolute;
  top: 0;
}

.subtitle {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 100;
  font-size: .8vw;
  color: rgba(165, 141, 141, .4);
  text-transform: uppercase;
  letter-spacing: 1em;
  text-align: center;
  position: absolute;
  left: 17%;
  animation: glitch-2 5s 5.02s infinite;
}

@keyframes glitch-2 {
  1%{
    transform: rotateX(10deg) skewX(70deg);
  }
  2%{
    transform: rotateX(0deg) skewX(0deg);
  }
}

@-webkit-keyframes blink {
  0% { opacity: 1.0; }
  50% { opacity: 0.0; }
  100% { opacity: 1.0; }
}

@keyframes blink {
  0% { opacity: 1.0; }
  50% { opacity: 0.0; }
  100% { opacity: 1.0; }
}

.anim-typewriter{
  animation: typewriter 4s steps(44) 1s 1 normal both,
             blinkTextCursor 500ms steps(44) infinite normal;
             width: 0;
}
@keyframes typewriter{
  from{opacity: 1}
  to{opacity: 1}
  from{width: 0;}
  to{width: 24em;}
}
@keyframes blinkTextCursor{
  from{border-right-color: rgba(255,255,255,.75);}
  to{border-right-color: transparent;}
}

.item-detail {
  background-color: black;
  position: fixed; 
  width: 700px;
  top: 100px;
  height: 700px;
  left: calc(50% - 350px);
  .item-close {
    color: white;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 50px;
    font-size: 26px;
    height: 50px;
    cursor: pointer;
  }
}

.item-close {

}
</style>
