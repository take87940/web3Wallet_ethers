import {ethers} from "ethers"
import { useState, useEffect } from "react"

const App = () =>
{
  const [balance, setBalance] = useState();
  const [currentAccount, setCurrentAccount] = useState();

  useEffect(()=>{
    if(!currentAccount || !ethers.isAddress(currentAccount)) return;

    if(!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    provider.getBalance(currentAccount).then((result) => {
      setBalance(ethers.formatEther(result));
    });
    provider.getNetwork().then((result) => {
      console.log(result);
    })
  }, [currentAccount])

  window.ethereum.on('accountsChanged', async function(accounts)
  {
    setCurrentAccount(accounts[0]);
  })

  const onClickConnect = () =>{
    if(!window.ethereum){
      console.log("please install metamask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    provider.send("eth_requestAccounts", [])
    .then((accounts) => {
      if(accounts.length > 0) setCurrentAccount(accounts[0])
    })
    .catch((e) => console.log(e));
  }

  const onClickDisConnect = () =>
  {
    console.log("onClickDisconnect!");
    setBalance(undefined);
    setCurrentAccount(undefined);
  }

  return (
    <div>
      {currentAccount
      ? <button onClick={onClickDisConnect}>
          Account:{currentAccount}
        </button>
      : <button onClick={onClickConnect}>
          Connect MetaMask
        </button>
      }
      {currentAccount
        ?<div>
           <div>ETH Balance of current account: {balance}</div>
         </div>
        :<div></div>
      }
    </div>
  )
}

export default App;