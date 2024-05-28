import { useEffect, useState } from "react";

import JamToken from "../abis/JamToken.json";
import StellartToken from "../abis/StellartToken.json";
import TokenFarm from "../abis/TokenFarm.json";

import Web3 from "web3";

import Navigation from "./Navbar";
import MyCarousel from "./Carousel";
import { Main } from "./Main";

export default function App() {
  const [account, setAccount] = useState("0x0");
  const [contracts, setContract] = useState({
    jamToken: null,
    stellartToken: null,
    tokenFarm: null,
  });
  const [jamTokenBalance, setJamTokenBalance] = useState("0");
  const [stellartTokenBalance, setStellartTokenBalance] = useState("0");
  const [stakingBalance, setStakingBalance] = useState("0");

  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    // 1. Carga de Web3
    await loadWeb3();
    // 2. Carga de datos de la Blockchain
    await loadBlockchainData();
  };

  useEffect(() => {
    loadData();
  }, []);


  // 1. Carga de Web3
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("¡Deberías considerar usar Metamask!");
    }
  };


  // 2. Carga de datos de la Blockchain
  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
    const networkId = await web3.eth.net.getId();
    console.log("networkid:", networkId);

    // Cargar del JamToken
    const jamTokenData = JamToken.networks[networkId]; // Obtenemos los datos de una network por medio de su Id
    if (jamTokenData) {
      const jamToken = new web3.eth.Contract(
        JamToken.abi,
        jamTokenData.address
      );
      setContract((prev) => ({ ...prev, jamToken }));
      let jamTokenBalance = await jamToken.methods
        .balanceOf(accounts[0])
        .call(); // Cuando obtenga informacion de la blockchain utilizo call()
      setJamTokenBalance(jamTokenBalance.toString());
    } else {
      alert('El JamToken no ha sido deplegado')
    }

    const stellartTokenData = StellartToken.networks[networkId]
    if(stellartTokenData){
      const stellartToken = new web3.eth.Contract(StellartToken.abi, stellartTokenData.address)
      setContract(prev => ({
        ...prev,
        stellartToken
      }))
      let stellartTokenBalance = await stellartToken.methods
      .balanceOf(accounts[0])
      .call(); 
      setStellartTokenBalance(stellartTokenBalance.toString())
    } else {
      alert('El StellartToken no ha sido deplegado')
    }

    const tokenFarmData = TokenFarm.networks[networkId]
    if(tokenFarmData){
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      setContract(prev => ({
        ...prev,
        tokenFarm
      }))
      let stakingBalance = await tokenFarm.methods.stakingBalance(accounts[0]).call()
      setStakingBalance(stakingBalance.toString())
    } else {
      alert('El TokenFarm no ha sido deplegado')
    }
    setLoading(false)
  };

  const stakeTokens = (amount) => {
    setLoading(true)
    const { jamToken, tokenFarm } = contracts
    const senderAddress = jamToken._address // direccion del contrato gestor
    jamToken.methods.approve(senderAddress, amount).send({ from: account }).on('transactionHash', (hash) => {
      tokenFarm.methods.stakeTokens(amount).send({ from: account }).on('transactionHash', (hash) => {
        setLoading(false)
      })
    }) // on() funciona hasta que el transaction hash se ponga en la blockchain
    // En esta funcion primero se aprueba el staking y luego se envia la cantidad a la que se le hace staking
  }

  const unstakeTokens = (amount) => {
    setLoading(true)
    const { jamToken, stellartToken, tokenFarm } = contracts
    tokenFarm.methods.unstakeTokens().send({ from: account }).on('transactionHash', (hash) => {
      setLoading(false)
    })
  }

  return (
    <div>
      <Navigation account={account} />
      <MyCarousel />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              {
                loading
                ? (
                  <p className="text-center">Loading...</p>
                )
                : (
                  <Main
                    jamTokenBalance={jamTokenBalance}  
                    stakingBalance={stakingBalance}
                    stellartTokenBalance={stellartTokenBalance}
                    stakeTokens={stakeTokens}
                    unstakeTokens={unstakeTokens}
                  />
                )
              }
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
