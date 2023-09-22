import { useEffect, useState } from 'react';
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

interface PoolCreated{
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  pool: string;
}

const ETH_MAINNET = import.meta.env.VITE_MAIN_NET_URL;

/* Contracts and Global Variables */
const factoryAbi = IUniswapV3Factory.abi;
const uniswapFactoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const provider = new ethers.JsonRpcProvider(ETH_MAINNET);
const uniswapContact = new ethers.BaseContract(uniswapFactoryAddress, factoryAbi, provider);

export const WatchForPools = () => {
  const [poolData, setPoolData] = useState<PoolCreated[]>([]);

  const watchUniswapForPools = async () => {
    uniswapContact.on('PoolCreated', (token0, token1, fee, tickSpacing, pool) => {
      console.log(`New Pool created at ${pool} with ${token0} and ${token1}`);

      const newPoolData: PoolCreated = {
        token0,
        token1,
        fee,
        tickSpacing,
        pool,
      };
      setPoolData([newPoolData])
    })
  }

  useEffect(() => {
    watchUniswapForPools();
  }, []);

  return (
    <>
      <Header />

      <div className="w-[60%] min-w-[560px] bg-blue-900 text-white h-[50vh] max-h-[460px] min-h-[400px] pt-10 mt-10 justify-center mx-auto my-0">
        <p className='justify-self-center text-center'>
          Newly Created Pools will be displayed here.
        </p>
        {poolData.length > 0 && (
          <div className="px-12 pt-10 justify-self-center text-center">
            {poolData.map((data, index) => (
              <div key={index}>
                <strong>Pool Address {index + 1}: </strong>
                <a
                  href={`https://etherscan.io/address/${data.pool}`}
                  target="_blank"
                  className="hover:text-blue-300">
                  {data.pool}
                </a>
                <p>
                  Token 1: {data.token0}
                </p>
                <p>
                  Token 2: {data.token1}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
