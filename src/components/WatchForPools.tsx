import { useEffect } from 'react';
import { ethers } from 'ethers'
// import { Alchemy, Network, TokenMetadataResponse } from 'alchemy-sdk'
import IUniswapV3Factory from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json'
import Header from './Header';

// const apiKey = import.meta.env.VITE_MAINNET_API_KEY;

// const settings: {apikey: string | undefined; network: Network} = {
//   apikey: apiKey,
//   network: Network.ETH_MAINNET,
// }
// const alchemy: Alchemy = new Alchemy(settings);

export interface TokenBalance {
  index: string;
  name: string | null;
  balance: string;
}

const ETH_MAINNET = import.meta.env.VITE_MAIN_NET_URL;

/* Contracts and Global Variables */
const factoryAbi = IUniswapV3Factory.abi;
const uniswapFactoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const provider = new ethers.JsonRpcProvider(ETH_MAINNET);
const uniswapContact = new ethers.BaseContract(uniswapFactoryAddress, factoryAbi, provider);

export const WatchForPools = () => {

  const watchUniswapForPools = async () => {
    uniswapContact.on('PoolCreated', (token0, token1, pool) => {
      console.log(`New Pool created at ${pool} with ${token0} and ${token1}`);
    })
  }

  useEffect(() => {
    watchUniswapForPools(); // Call your function here
  }, []); // The empty dependency array [] ensures this runs only once when the component is mounted


  return (
    <>
      <Header />
      <p>Let's watch for some pools</p>
      <div>

      </div>
    </>
  )
}
