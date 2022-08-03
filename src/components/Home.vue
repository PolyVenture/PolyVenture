<template>
  <div class="main" @keyup.enter="handleEnterKey">
    <div class="container desktop">
      <div class="col-md-12">
        <div class="console">
          <div class="col-md-5">
           <div class="glitch" style="margin-top: 100px" v-if="!playpassEnabled" data-text="POLYVENTURE">POLYVENTURE</div>
           <div class="glitch" v-if="playpassEnabled" data-text="POLYVENTURE">POLYVENTURE</div>
          </div>
            <div class="scanlines"></div>

            <div v-if="!playpassEnabled" style="position: relative; z-index: 2; width: 700px">
              <p>To play PolyVenture you need to obtain an Access Card. During Alpha phase the Access Card is free</p>

              <div v-if="wrongNetworkMessage.length > 0 || !account">
                <a class="btn btn-purchase" v-if="wrongNetworkMessage.length > 0 && account" style="float: left; margin-right: 20px; width: 300px" @click="requestPolygon()">Switch to Polygon Network</a>
                <a class="btn btn-purchase" v-if="!account" style="float: left; margin-right: 20px; width: 300px" @click="requestAccount()">Connect Account {{account}}</a>
                <a class="btn btn-purchase disabled" style="float: left; width: 300px;">Mint a free Access Card</a>
              </div>
              <div  v-if="wrongNetworkMessage.length === 0 && account">
                <a class="btn btn-purchase" v-if="!hasPass" @click="openMint()">Mint a free Access Card</a>
                
                <p style="margin-top: 15px; font-weight: 600" v-if="hasPass">Access Card was found on your account. Choose your Access Card</p>
                <div style="text-align: left;" v-if="hasPass">
                <select v-model="passChoice"  style="margin-left: 0; text-align: left" class="select-spec">
                  <option  v-for="(pass) in passList"  :key="pass" :value="pass">Access Card #{{pass}}</option>
                </select>
                </div>
                <div style="width: 100%;">
                <a class="btn btn-purchase" v-if="hasPass" style="width: 300px;" @click="start(passChoice)">Start</a>
                </div>
              </div>


            </div>

          <div class="con col-md-6" v-if="playpassEnabled" id="con" style="height: 400px; overflow: scroll; scrollbar-width: none;  padding-bottom: 50px;">
              <div v-for="item in previousCommands" :key="item" style="width: 700px; margin-left:5px;" id="conwrap" class="conwrap">
                <p v-if="item.char === 'user'" style="text-transform:uppercase;">> {{item.message}}</p>
                <p v-if="item.char === 'sug'" class="anim-typewriter" style="color: white; height: 20px!important;  overflow: hidden; text-transform:uppercase;">{{item.message}}</p>
                <p v-if="item.char === 'computer'" class="anim-typewriter" style="height: 20px!important;  overflow: hidden; ;font-weight: 800; opacity: 0; text-transform:uppercase;">{{item.message}}</p>
                <p v-if="item.char === 'forest'" class="anim-typewriter" style="height: 20px!important;  overflow: hidden; color: #00ffa5;font-weight: 800; opacity: 0; text-transform:uppercase;">{{item.message}}</p>
                <p v-if="item.char === 'puzzle'" class="anim-typewriter" style="height: 20px!important;  overflow: hidden; color: #ffc400;font-weight: 800; opacity: 0; text-transform:uppercase;">{{item.message}}</p>
                <p v-if="item.char === 'death'" class="anim-typewriter" style="height: 20px!important;  overflow: hidden; color: red;font-weight: 800; opacity: 0; text-transform:uppercase;">{{item.message}}</p>

              </div>
              <div class="clearfix" style="margin-top: 10px; width: 34%; padding: 5px; position: fixed; bottom: 200px;">
              <p class="cursor">></p>
              <input autofocus type="text" v-model="inputString" class="inp-cursor"  refs="cursi">
              </div>
          </div> 
          <div v-if="playpassEnabled" class="img-hld col-md-6" :class="imgLoader"></div>           
        </div>
      </div>
    </div>
    <div class="mobile">
       <div class="console">
          <div class="col-md-5">
           <div class="glitch" style="margin-top: 100px; position: absolute; text-align: center;" v-if="!playpassEnabled"  data-text="POLYVENTURE">POLYVENTURE</div>
           <div class="glitch" v-if="playpassEnabled" style="position: absolute!important" data-text="POLYVENTURE">POLYVENTURE</div>
          </div>
            <div class="scanlines"></div>
            </div>
      <h2 style="margin-top: 200px; font-family: 'Fira Mono';color: #6aff00; text-align: left;">[REDACTED]</h2>
      <h2 style="margin-top: 200px; font-family: 'Fira Mono';color: #6aff00; text-align: left;">Only available on desktop devices</h2>
    </div>
    <div class="backpack" v-if="backpackEnabled && playpassEnabled">
      <p class="bp-title">BACKPACK</p>
       <div class="scroll" style="color: #E7E7E7; font-size: 12px; padding-top: 5px; color: #ffc107; text-align: center">owner: glassvault.eth</div>
      <div class="slot key__512" style="border-color: white" @click="openDetail('key__512')"></div>
      <div class="slot rope__512" style="border-color: white" v-if="ropeDiscovered" @click="openDetail('rope__512')"></div>
      <div class="slot sword__512" style="border-color: white" v-if="swordDiscovered" @click="openDetail('sword__512')"></div>
      <div class="slot note__512" style="border-color: white" v-if="noteDiscovered" @click="openDetail('note__512')"></div>
      <div class="slot pass__512" style="border-color: white" v-if="passDiscovered" @click="openDetail('pass__512')"></div>
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


<div v-if="mintOpen || detailOpen" class="opacitylayer" @click="closeAll()"></div>

  <div class="item-detail mint" v-if="mintOpen">

  <div class="scanlines"></div>
  
      <div class="item-close" @click="closeMint()">x</div>

      <div v-if="!NFTLoading">
        <div class="card animate__animated animate__pulse glitch"></div>
        <div  style="position: absolute; font-weight: 200;  left: 50px; width: 400px; bottom: 45px;">
        <p style="font-family: 'Fira Mono';color: #00de00;">Access Cards are used to track your progress during your adventure. The pass will be minted and stored in your Polygon wallet.</p>
        <a class="btn btn-purchase" @click="mintNFT()">Mint a free Access Card</a>
        </div>
      </div>
      <div v-if="NFTLoading" style="padding: 40px; position: absolute; z-index: 5;">
        <p style="font-family: 'Fira Mono';color: #00de00;">NFT Minting in Progress.</p>
        <a target="_blank" :href="`https://polygonscan.com/tx/${txHash}`" v-if="txHash.length > 0" class="btn btn-purchase">View TX</a>
      </div>

  </div>

  <div class="item-detail" v-if="detailOpen">
      <div class="item-close" @click="closeDetail()">x</div>
      <div :class="loadedImage" style="width: 100%; height: 100%;"></div>
      <div class="mintable" v-if="mint[loadedImage.split('__512')[0]] == false && !itemMintLoading">
        <p>Items can be minted to your wallet. This will make the item tradeable will others. You can only mint every item once per pass. <strong>Further progression leads to rarer items.</strong> <br>
        <a v-if="loadedImage.split('__512')[0] != 'pass'" class="btn btn-purchase" style="margin-top: 30px;" @click="mintItem(loadedImage.split('__512')[0])">Mint {{loadedImage.split("__512")[0]}}</a>
        <a v-if="loadedImage.split('__512')[0] == 'pass'" class="btn btn-purchase" style="margin-top: 30px;" @click="mintPass()">Mint Access Pass 2</a>
        </p></div>

      <div class="mintable" v-if="mint[loadedImage.split('__512')[0]] == false && itemMintLoading">
        <p>Waiting for blockchain confirmation.. <br>
        <a v-if="itemMintTX.length > 0" class="btn btn-purchase" target="_blank" :href="itemMintTX" style="margin-top: 30px;">View Transaction</a>
        </p></div>

        <div class="mintable" v-if="mint[loadedImage.split('__512')[0]] == true">
        <p>This item has been minted to your Polygon wallet 
        <a class="btn btn-purchase" style="margin-top: 30px;" target="_blank" href="https://testnets.opensea.io/account?search%5BresultModel%5D=ASSETS&search%5BsortBy%5D=LAST_TRANSFER_DATE&search%5Bquery%5D=PolyVenture">View on OpenSea</a>
        </p></div>

      <!-- <div class="mint-progress">
        <p>Minting item... <strong>Further progression leads to rarer items.</strong> <br>
        <a class="btn btn-purchase" target="_blank" style="margin-top: 30px;">View TX Hash</a>
        </p></div> -->

  </div>


  </div>

  
</template>

<script>
import { AccessCardNFT } from '../abis/AccessCardNFT.js'
import { PolyVentureItems } from '../abis/PolyVentureItems'
import { mapGetters } from "vuex";
export default {
  name: 'HomeComponent',
  props: {
    msg: String
  }, 
  data: function() {
    return {
      mintOpen: false,
      previousCommands: [],
      passChoice: 0,
      cur: "",
      mint: {
        key: false,
        rope: false, 
        sword: false,
        note: false,
        pass: false,
      },
      itemMintTX: "",
      playpassEnabled: false,
      inputString: "",
      currentStep: 1,
      backpackEnabled: false,
      forestExplained: false,
      mintInProgress: false,
      ropeDiscovered: false,
      swordDiscovered: false,
      noteDiscovered: false,
      passDiscovered: false,
      imgLoader: "",
      bridgeStart: false,
      lockSolved: false,
      detailOpen: false,
      itemMintLoading: false,
      loadedImage: "",
      NFTLoading: false,
      txHash: ""
    }
  },
  watch: {
    async currentPass() {
      await this.getItemStatus()
      if(this.previousCommands.length != 0) return 
      this.delaySend('computer', `> PASS HOLDER #(${this.currentPass}) IDENTIFIED `, 0)
      if(this.mint.key || this.mint.rope || this.mint.sword || this.mint.note) {
      this.delaySend('computer', '> PROGRESS FOUND', 2500)
      this.delaySend('computer', '> SYNCHRONISING WITH BLOCKCHAIN', 5000)
      this.delaySend('computer', '> USE COMMAND "START" TO BEGIN SIMULATION', 7500)

      this.updateProgress()
      } else {
      this.delaySend('computer', '> USE COMMAND "START" TO BEGIN SIMULATION', 2500)
      }
    },
    passList() {
      this.passChoice = this.passList[0];
    }
  },
  computed: {
    ...mapGetters({
      getProviderLoggedIn: "getProviderLoggedIn",
      web3store: "getWeb3",
      hasPass: "getPass",
      currentPass: "getCurrentPass",
      passList: "getPassList",
      account: "getAccount",
      wrongNetworkMessage: "getWrongNetworkMessage"
    })
  },
  methods: {
    updateProgress() {
      // if(this.mint.key) {

      // }
      if(this.mint.rope) {
        this.ropeDiscovered = true;
        this.forestExplained = true;
      }
      if(this.mint.sword) {
        this.lockSolved = true;
        this.swordDiscovered = true
        this.forestExplained = true;
      }
      if(this.mint.note) {
        this.lockSolved = true;
        this.noteDiscovered = true
        this.forestExplained = true;
      }
      if(this.mint.pass) {
        this.passDiscovered = true;
      }
    },
    capitalize(str) {
      const lower = str.toLowerCase();
      return str.charAt(0).toUpperCase() + lower.slice(1);
    },
    start(idx) {
      this.playpassEnabled = true
      this.$store.commit("setCurrentPass", idx)
    },
    async getItemStatus() {
      let itemsContract = await new this.web3store.eth.Contract(PolyVentureItems, "0xdD4Ff147C3DAfD6abE64aa656B233D3ABd63199f");
      let itemStatus = await itemsContract.methods.mintStatus(this.currentPass).call()
      if(itemStatus.length == 5) {
        this.mint.key = itemStatus[0]
        this.mint.rope = itemStatus[1]
        this.mint.sword = itemStatus[2]
        this.mint.note = itemStatus[3]
        this.mint.pass = itemStatus[4]
      }
    },


    async mintPass() {
      this.itemMintTX = ""
      this.itemMintLoading = true;
      let itemsContract = await new this.web3store.eth.Contract(PolyVentureItems, "0xdD4Ff147C3DAfD6abE64aa656B233D3ABd63199f");
      await itemsContract.methods.mintAccessPass(this.account, this.currentPass, "carrier").send({from: this.account, gas: '300000', gasPrice: '80000000000'}).on('transactionHash', (hash) => {
        this.itemMintTX = hash;
      }).on('confirmation', async() => {
        // sync with blockchain
        this.getItemStatus()
        this.itemMintLoading = false;
      })
      // sync with blockchain
      this.getItemStatus()

    },


    async mintItem(item) {
      this.itemMintTX = ""
      this.itemMintLoading = true;
      let itemsContract = await new this.web3store.eth.Contract(PolyVentureItems, "0xdD4Ff147C3DAfD6abE64aa656B233D3ABd63199f");
      let funcName = "mint" + this.capitalize(item)
      await itemsContract.methods[funcName](this.account, this.currentPass).send({from: this.account, gas: '300000', gasPrice: '80000000000'}).on('transactionHash', (hash) => {
        this.itemMintTX = hash;
      }).on('confirmation', async() => {
        // sync with blockchain
        this.getItemStatus()
        this.itemMintLoading = false;
      })
      // sync with blockchain
      this.getItemStatus()

    },
    async mintNFT() {
      this.NFTLoading = true;
      console.log("0xfC5aC5510D2834DC31884C8d6F6aFB1f7753Ee6c")
      let nftContract = await new this.web3store.eth.Contract(AccessCardNFT, "0xfC5aC5510D2834DC31884C8d6F6aFB1f7753Ee6c");
      await nftContract.methods.mintTo(this.account).send({from: this.account, gas: '300000', gasPrice: '80000000000'}).on('transactionHash', (hash) => {
        this.txHash = hash
      }).on('confirmation', async() => {
        await this.$store.dispatch("getPass", this.account)
        this.closeMint()
        this.NFTLoading = false;
      })
      await this.$store.dispatch("getPass", this.account)
      this.NFTLoading = false;
    },
    openMint: function() {
      this.mintOpen = true;
    },
    closeMint: function() {
      this.itemMintLoading = false;
      this.getItemStatus()
      this.mintOpen = false;
    },
    goSetup: function() {
      this.$router.push("/setup")
    },

    async requestAccount() {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.getAccounts()

    },
    async getAccounts() {
      let accounts = await this.web3store.eth.getAccounts();
      this.$store.commit("setAccount", accounts[0]);
      this.$store.dispatch("getBalance", this.account);
      
      this.getBalance = () => {
        this.$store.dispatch("getBalance", this.account);
        setTimeout(() => {
          this.getBalance();
        }, 10000);
      };
    },
    async requestPolygon() {
        let chainId = 80001
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
                      chainName: 'Polygon Mumbai',
                      chainId: this.web3store.utils.toHex(chainId),
                      nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                      rpcUrls: ['https://rpc-mumbai.maticvigil.com']
                    }
                  ]
                }).then(() => console.log("done"))
                 this.$store.commit("setWeb3", this.web3store);
              }
            }
          }
    },

    checkpointManager: function() {

    },

    closeAll: function() {
      this.detailOpen = false;
      this.mintOpen = false;
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
        this.updateScroll()
        this.previousCommands.push({char: author, message})
        this.updateScroll()
        }, delay)

      setTimeout(() => {
        this.updateScroll()
      }, delay + 1500)
    },

    updateScroll(){
      var container = this.$el.querySelector("#con");
      if(container) container.scrollTop = 500000;
    },


    // program boot
    checkpoint1: function() {
      // empty
    },

    restart() {
        this.delaySend("sug", "// simulation restarted",0)
        this.delaySend("sug", "// chapter - 01 //", 2500)
        this.delaySend("computer", "you wake up", 5000)
        setTimeout(() => { this.imgLoader = "beach" }, 5000)
        if(this.backpackEnabled) {
          this.delaySend("computer", "a backpack is in your hand", 7500)
          this.delaySend("computer", "your head hurts", 10000)
          setTimeout(() => { this.checkpoint2() }, 12500)
        } else {
          this.delaySend("computer", "your head hurts", 7500)
          setTimeout(() => { this.checkpoint2() }, 10000)
        }

    },

    checkpoint1Handler: function(input) {
      if(input === 'start') {
        if(this.mint.key) {
          this.backpackEnabled = true
          this.restart()
        }
        else {
          this.previousCommands.push({char: 'sug', message: "// simulation booted //"})
          this.delaySend("sug", "// chapter - 01 //", 2500)
          this.delaySend("computer", "you wake up on a beach", 5000)
          setTimeout(() => { this.imgLoader = "beach" }, 7500)
          setTimeout(() => { this.checkpoint2() }, 7500)
        }
      }
    },

    // BEACH
    checkpoint2: function() {
      this.currentStep = 2;
      this.imgLoader = "beach"
      if(!this.backpackEnabled) {
        this.delaySend("computer", "there is a backpack on the sand", 0)
        this.delaySend("computer", "open backpack?", 2500)
      } else {
        this.delaySend("sug", "you are back on the beach", 0)
        this.delaySend("computer", "there isn't much to do here", 2500)
        this.delaySend("computer", "The path north leads towards a town", 5000)
        this.delaySend("computer", "The path east leads towards a forest", 7500)
      }

      },
      checkpoint2Handler: function(input) {
        if(!this.backpackEnabled) {
          if(input === 'open' || input === 'yes' || input === 'ok') {
          this.previousCommands.push({char: 'computer', message: "you open the backpack"})
          setTimeout(() => {this.backpackEnabled = true }, 2500)
          this.delaySend("computer", "the backpack contains a key", 2500)
          this.delaySend("puzzle", "I should give the key a closer look", 5000)
          this.delaySend("computer", "there are 2 paths from here.", 7500)
          this.delaySend("computer", "The path north leads towards a town", 10000)
          this.delaySend("computer", "The path east leads towards a forest", 12500)
          setTimeout(() => { this.openDetail("key__512") }, 8500)
         }
         if(input === 'leave' || input === 'no') {
            this.delaySend("computer", "I will ignore the backpack", 0)
            this.delaySend("computer", "there are 2 paths from here.", 2500)
            this.delaySend("computer", "The path north leads towards a town", 5000)
            this.delaySend("computer", "The path east leads towards a forest", 7500)
         } 
        }
        if(input === 'east' || input === 'forest') {
          this.checkpoint3()
        }
        if(input === 'north' || input === 'town') {
          this.checkpoint4()
        }
      
      },

      // FOREST 
      checkpoint3: function() {
        this.currentStep = 3;
        setTimeout(() => { this.imgLoader = "forest" }, 2500)
        if(this.ropeDiscovered) {
          this.delaySend("sug", "You enter the forest", 0)
          this.delaySend("computer", "There is not much to do here", 2500)
          this.delaySend("computer", "You can go back to the beach", 5000)
          this.delaySend("computer", "Or take the rope down", 7500)
        } else {
         if(!this.forestExplained) {
          this.delaySend("sug", "You enter the forest", 0)
          this.delaySend("computer", "There is a giant crater", 2500)
          this.delaySend("computer", "in front of you", 5000)
          this.delaySend("computer", "a voice calls", 7500)
          this.delaySend("forest", `'you must be participant ${this.currentPass}'`, 10000)
          this.delaySend("forest", "help me solve this puzzle and you", 12000)
          this.delaySend("forest", "will receive a gift", 14000)
          this.forestExplained = true; 
        } else {
          this.delaySend("sug", "You enter the forest", 0)
          this.delaySend("computer", "a voice calls again", 2500)
          this.delaySend("forest", `'ah participant ${this.currentPass} again'`, 5000)
          this.delaySend("forest", "did you come back to", 8000)
          this.delaySend("forest", "solve my puzzle?", 10000)
          this.delaySend("forest", "or do you just want to look", 12500)
          this.delaySend("forest", "at the crater?", 15000)
        }

        this.delaySend("puzzle", "4 9 3 6 ", 16500)
        this.delaySend("puzzle", "4 2 0 8", 17500)
        this.delaySend("puzzle", "8 1 0 8", 18500)
        this.delaySend("puzzle", "9 9 8 ?", 19000)

        this.delaySend("puzzle", "What is ?", 20000)

        this.delaySend("sug", "you can also return to the", 22000)
        this.delaySend("sug", "beach with the `back' command",24000)
        }

      },
      checkpoint3Handler: function(input) {
        if(input === 'back' || input === 'beach' || input === 'head back') {
          this.checkpoint2()
        }
        if(input === 'look', input === 'look at crater') {
          this.delaySend("forest", "not much to see, just a big hole", 0)
        }
        if(this.ropeDiscovered) {
          if(input === 'climb down' || input === 'down' || input === 'rope down' || input === 'yes' || input === 'climb' || input === 'rope') {
            this.checkpoint7()
          }
        }

        if(input === '1' && !this.ropeDiscovered) {
          this.delaySend("forest", "you did it!", 0)
          this.delaySend("forest", "we will meet again", 2500)
          this.delaySend("forest", "take this, it might help", 5000)
          this.delaySend("sug", "you receive a rope", 7500)
          this.delaySend("sug", "you can use this rope to climb down", 10000)
          setTimeout(() => { this.openDetail("rope__512") }, 12000)

          this.delaySend("computer", "climb rope down or head back?", 12000)
          if(!this.backpackEnabled) {
            this.delaySend("computer", "that backpack from the beach", 12000)
            this.delaySend("computer", "might be useful to carry it", 14000)
            this.delaySend("computer", "in case I need it later", 16000)
            this.delaySend("computer", "climb rope down?", 18000)
          }
           setTimeout(() => { this.ropeDiscovered = true}, 7500)
        }
      },
      // town
      checkpoint4: function() {
        this.currentStep = 4;
        setTimeout(() => { this.imgLoader = "intersection" }, 2500)
        if(this.swordDiscovered) {
         this.delaySend("computer", "You start walking towards the town", 0)
         this.delaySend("computer", "You can still hear the alarms", 2500)
         this.delaySend("computer", "coming from the mansion", 5000)
         this.delaySend("computer", "You can keep walking north towards town", 7500)
         this.delaySend("computer", "or walk back to the beach", 10000)

        } else {
        this.delaySend("computer", "You start walking towards", 0)
        this.delaySend("computer", "the town. There is a large mansion", 2500)
        this.delaySend("computer", "in the distance. Approach mansion?", 5000)
        // checkpoint 8
        this.delaySend("sug", "You can also keep walking north", 7500)
        this.delaySend("sug", "towards town or head back", 10000)
        this.delaySend("sug", "to the beach", 12500)
        // checkpoint 9 
        }

      },

      checkpoint4Handler: function(input) {
        if(input === 'back' || input === 'beach' || input === 'head back') {
          this.checkpoint2()
        }
        if(input === 'enter' || input === 'approach mansion' || input == 'mansion' || input === 'yes' || input ==='approach') {
          if(this.swordDiscovered) {
            this.delaySend("computer", "that's not a great idea.", 0)
          }
          
          else if(this.lockSolved) {
            // enter mansion
            this.checkpoint1()
          } else {
            // solve lock puzzle
            this.checkpoint8()
          }
        }
        if(input === 'no' || input === 'north' || input === 'keep walking north' || input === 'keep walking' || input === 'walk north' || input === 'town' || input === 'go north') {
          this.checkpoint9()
        }
      },

      checkpoint7: function() {
        this.currentStep = 7;
        setTimeout(() => { this.imgLoader = "forest-hole" }, 2500)
        this.delaySend("sug", "The rope takes you into a", 0)
        this.delaySend("sug", "deep hole.", 2500)


        if(!this.noteDiscovered) {
          this.delaySend("death", "you hear a loud creature.", 5000)
          setTimeout(() => { this.imgLoader = "creature" }, 7500)
          if(this.swordDiscovered) {
            this.delaySend("computer", "you draw your sword", 7500)
            this.delaySend("computer", "and slash the creature", 10000)
            this.delaySend("computer", "the creature flees", 12500)
            this.delaySend("computer", "you find a note", 15000)
            this.delaySend("puzzle", "I should inspect the note", 17500)
            setTimeout(() => { this.openDetail("note__512") }, 20000)
            setTimeout(() => { this.noteDiscovered = true }, 17500)
            this.delaySend("puzzle", "There is nothing left to do here", 20000)
            this.delaySend("puzzle", "I should head back to the forest", 20000)
          } else {
            this.delaySend("death", "the creature approaches", 7500)
            this.delaySend("death", "you are unable to defend yourself", 10000)
            setTimeout(() => { this.restart()}, 13000)
          }
        } else {
          this.delaySend("puzzle", "There is nothing left to do here", 5000)
          this.delaySend("puzzle", "I should head back to the forest", 7500)
        }
      },

      checkpoint7Handler:function(input) {
        if(input === 'back' || input === 'forest' || input === 'head back') {
          this.checkpoint3()
        }
      },

      checkpoint8: function() {
        this.currentStep = 8;
        setTimeout(() => { this.imgLoader = "mansion-gate" }, 2500)
        this.delaySend("computer", "you approach the mansion gate", 0)
        this.delaySend("computer", "there is a keypad locking the gate", 2500)
        this.delaySend("puzzle", "It requires me to enter a ", 5000)
        this.delaySend("puzzle", "4 digit code", 7500)
        this.delaySend("sug", "you can always go back", 10000)
        this.delaySend("sug", "with the 'back' command", 12500)
      },

      checkpoint8Handler: function(input) {
        // 4912
        if(input === '4912') {
          // keypad sovled
          this.checkpoint11()
        }
        if(input === 'back') {
          this.checkpoint4()
        }
      },

      checkpoint9: function() {
        this.currentStep = 9;
        this.bridgeStart = true;
        this.delaySend("computer", "on your way to town", 0)
        this.delaySend("computer", "you approach a bridge", 2500)
        this.delaySend("computer", "there is a guard on the bridge", 5000)
        this.delaySend("computer", "he speaks to you:", 7500)

        this.delaySend("puzzle", "invited guests may cross", 10000)
        this.delaySend("puzzle", "to the land beyond the moss ", 12500)
        this.delaySend("puzzle", "this invitation is part of a scroll", 15000)
        this.delaySend("puzzle", "and it is located in a hole", 17500)
        this.delaySend("puzzle", "once you know the secret word", 20000)
        this.delaySend("puzzle", "my gift will be transferred", 22500)

        this.delaySend("sug", "you can always go back", 25000)
        this.delaySend("sug", "with the 'back' command", 27500)
      },

      checkpoint9Handler: function(input) {
        if(input === 'back') {
          this.checkpoint4()
        }
        if(input === 'carrier') {
          this.delaySend("puzzle", "you may pass beyond", 2500)
          this.delaySend("puzzle", "when the time comes you should", 5000)
          this.delaySend("puzzle", "come back here to respond.", 7500)
          this.delaySend("puzzle", "take my gift.", 10000)
          this.delaySend("sug", "access key level 2 obtained.", 12500)
          this.delaySend("computer", "CHAPTER 1 - CLEARED", 15000)
          this.delaySend("computer", "CHAPTER 2 - AWAITING RELEASE", 17500)
          setTimeout(() => { this.passDiscovered = true; }, 14000);
          setTimeout(() => { this.openDetail("pass__512") }, 14000)
        }
      },

      checkpoint11: function() {
        this.currentStep = 11;
        setTimeout(() => { this.imgLoader = "mansion-exterior" }, 2500)
        this.delaySend("computer", "the lock opens", 0)
        this.delaySend("computer", "you walk towards the front of", 2500)
        this.delaySend("computer", "the mansion. The front door is blocked", 5000)
        this.delaySend("computer", "One of the windows on the second floor", 7500)
        this.delaySend("computer", "is open.", 10000)

        if(this.ropeDiscovered) {
          this.delaySend("computer", "use rope to climb?", 12500)
        } else {
          this.delaySend("computer", "I don't have anything to ", 12500)
          this.delaySend("computer", "climb inside.", 15000)
        }
      },

      checkpoint11Handler: function(input) {
        if(input === 'back') {
          this.checkpoint4();
        }
        if(input === 'climb' || input === 'rope' || input === 'use rope' ||  input === 'yes' || input === 'window') {
          this.checkpoint12()
        }
      },

      checkpoint12: function() {
        this.currentStep = 12;
        this.imgLoader = "mansion-interior"
        this.delaySend("computer", "you climb through the window and find", 0)
        this.delaySend("computer", "yourself standing inside a large room.", 2500)
        this.delaySend("computer", "there is a sword mounted on the wall.", 5000)
        this.delaySend("computer", "you take the sword.", 7500)
        setTimeout(() => { this.openDetail("sword__512") }, 15000)

        this.delaySend("death", "an alarm sounds.", 11000)
        this.delaySend("death", "I am leaving.", 13500)
        setTimeout(() => { this.checkpoint4() }, 15000) 
         setTimeout(() => {this.swordDiscovered = true }, 5000)
      },

      checkpoint12Handler: function() {

      },

    handleEnterKey: function() {
      this.previousCommands.push({char: 'user', message: this.inputString})
      this["checkpoint" + this.currentStep + "Handler"](this.inputString.toLowerCase())
      this.inputString = ""
      setTimeout(() => {
        this.updateScroll()
      }, 100)
    }
  },
    mounted() {
      console.log("> GLITCH")
      console.log("> IS THIS A CLUE?")
      console.log("The beach awaits")
      console.log("The forest awaits")
      console.log("The mansion awaits")
      console.log("The forest awaits?")
      console.log("The cave awaits?")
      console.log("The bridge awaits?")
      console.log("The CASTLE awaits")
      console.log("IS THIS A CLUE?")
      console.log("> PROBABLY MNSGHMF")
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.backpack::-webkit-scrollbar {
  display: none;
}

// hides scrollbars while allowing to scroll
div::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
.select-spec {
  background-color: black!important;
  border: none;
  color:white;
  width: 300px;
  outline: none;
  margin-bottom: 30px;
}

.opacitylayer {
  position: absolute;
  top: 0;
  left: 0; 
  width: 100%;
  height: 100vh;
  background-color: #3858966b;
  z-index: 2;
}

.card  {
  background-image: url("../assets/card.png");
  background-size: cover; 
  width: 512px;
  margin-top: -20px;
  left: calc(50% - 256px);
  background-color: transparent;
  height:  512px;
  border: none;
}

.btn-purchase {
    border: none;
    border-radius: 0;
    background-color: #ff0cc7;
    border-bottom: 4px solid #97144d;
    color: white;
        font-family: 'Fira Mono';
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
  bottom: 20px;
  right: 40px;

}

.key__512 {
  background: url("../assets/key__512.png");
  background-size: cover;
}

.img-hld {
    background-color: green;
    width: 40%;
    margin-left: 10%;
    border-radius: 0px;
    margin-top: 0px;
    height: 290px;
    float: left;
    display: none;
    text-align: right;
    border: 4px solid #0f0e0e;

    &.beach {
      background: url("../assets/bg_beach.png");
      display: block;
    }

    &.forest {
      background: url("../assets/bg_forest.png");
      display: block;
    }

    &.forest-hole {
      background: url("../assets/forest-hole.png");
      display: block;
    }

    &.intersection {
      background: url("../assets/intersection.png");
      display: block;
    }

    &.mansion-gate {
      background: url("../assets/mansion-gate.png");
      display: block;
    }

    &.mansion-exterior {
      background: url("../assets/mansion-exterior.png");
      display: block;
    }

    &.mansion-interior {
      background: url("../assets/mansion-interior.png");
      display: block;
    }

    &.creature {
      background: url("../assets/creature.png");
      display: block;
    }
}

.rope__512 {
  background: url("../assets/rope__512.png");
  background-size: cover;
}

.sword__512 {
  background: url("../assets/sword__512.png");
  background-size: cover;
}

.note__512 {
  background: url("../assets/note__512.png");
  background-size: cover;
}

.pass__512 {
  background: url("../assets/pass__512.png");
  background-size: cover;
}



.backpack {
  height: 250px; 
  width: 300px;
  position:fixed;
  padding-left: 8px;
  bottom: 30px;
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
  width: 92%;
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
  float: left;
  padding: 20px;
    background-color: #231f1f1a;
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

// @keyframes glitch {
//   1%{
//     transform: rotateX(10deg) skewX(90deg);
//   }
//   2%{
//     transform: rotateX(0deg) skewX(0deg);
//   }
// }


.desktop {
  @media(max-width: 880px) {
    display: none;
  }
}

.mobile {
  display: none;
  @media(max-width: 880px) {
    display: block;
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
  animation: typewriter 2s steps(44) 2s 1 normal both,
             blinkTextCursor 250ms steps(44) infinite normal;
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
  z-index: 3;
  overflow: hidden;
  width: 500px;
  top: 80px;
  height: 500px;
  left: calc(50% - 250px);
  .mintable {
    background-color: #121111;
    width: 500px; 
    position: fixed;
    z-index: 5;
    padding-bottom: 20px;
    p {
      color: white;
      padding: 20px;
    }
  }
  &.mint {
    height: 550px; 
     left: calc(50% - 250px);
    width: 500px; 
    background-color: #1e1c1f;
    border-bottom: 7px solid black;
  }
  .item-close {
    color: white;
    z-index: 5;
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
