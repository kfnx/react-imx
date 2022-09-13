import './App.css';
import { Link, ImmutableXClient, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { useEffect, useState } from 'react';
import Marketplace from './Marketplace';
import Inventory from './Inventory';
import Bridging from './Bridging';
require('dotenv').config();

console.table([
  ["REACT_APP_ROPSTEN_LINK_URL", process.env.REACT_APP_ROPSTEN_LINK_URL],
  ["REACT_APP_ROPSTEN_ENV_URL", process.env.REACT_APP_ROPSTEN_ENV_URL],
  ["REACT_APP_ROPSTEN_STARK_CONTRACT_ADDRESS", process.env.REACT_APP_ROPSTEN_STARK_CONTRACT_ADDRESS],
  ["REACT_APP_ROPSTEN_REGISTRATION_ADDRESS", process.env.REACT_APP_ROPSTEN_REGISTRATION_ADDRESS],
  ["REACT_APP_ALCHEMY_API_KEY", process.env.REACT_APP_ALCHEMY_API_KEY],
  ["REACT_APP_MINTER_PK", process.env.REACT_APP_MINTER_PK],
  ["REACT_APP_TOKEN_ADDRESS", process.env.REACT_APP_TOKEN_ADDRESS],
  ["REACT_APP_ROYALTY_ADDRESS", process.env.REACT_APP_ROYALTY_ADDRESS],
  ["REACT_APP_TOKEN_RECEIVER_ADDRESS", process.env.REACT_APP_TOKEN_RECEIVER_ADDRESS],
])

const App = () => {
  // initialise Immutable X Link SDK
  const link = new Link(process.env.REACT_APP_ROPSTEN_LINK_URL)

  // general
  const [tab, setTab] = useState('marketplace');
  const [wallet, setWallet] = useState('undefined');
  const [balance, setBalance] = useState<ImmutableMethodResults.ImmutableGetBalanceResult>(Object);
  const [client, setClient] = useState<ImmutableXClient>(Object);


  useEffect(() => {
    buildIMX()
  }, [])

  // initialise an Immutable X Client to interact with apis more easily
  async function buildIMX() {
    const publicApiUrl: string = process.env.REACT_APP_ROPSTEN_ENV_URL ?? '';
    setClient(await ImmutableXClient.build({ publicApiUrl }))
  }

  // register and/or setup a user
  async function linkSetup(): Promise<void> {
    const res = await link.setup({})
    setWallet(res.address)
    setBalance(await client.getBalance({ user: res.address, tokenAddress: 'eth' }))
  };

  function handleTabs() {
    if (client.address) {
      switch (tab) {
        case 'inventory':
          if (wallet === 'undefined') return <div>Connect wallet</div>
          return <Inventory
            client={client}
            link={link}
            wallet={wallet}
          />
        case 'bridging':
          if (wallet === 'undefined') return <div>Connect wallet</div>
          return <Bridging
            client={client}
            link={link}
            wallet={wallet}
          />
        default:
          return <Marketplace
            client={client}
            link={link}
          />
      }
    }
    return null
  }

  return (
    <div className="App">
      <button onClick={linkSetup}>Setup</button>
      <div>
        Active wallet: {wallet}
      </div>
      <div>
        ETH balance (in wei): {balance?.balance?.toString()}
      </div>
      <button onClick={() => setTab('marketplace')}>Marketplace</button>
      <button onClick={() => setTab('inventory')}>Inventory</button>
      <button onClick={() => setTab('bridging')}>Deposit and withdrawal</button>
      <br /><br /><br />
      {handleTabs()}
    </div>
  );
}

export default App;
