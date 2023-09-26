import { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { ethers } from 'ethers'
import { Alchemy, Network, TokenMetadataResponse } from 'alchemy-sdk'
import IUniswapV3Factory from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json'
import Header from './Header';

const apiKey = import.meta.env.VITE_MAINNET_API_KEY;

const settings: {apikey: string | undefined; network: Network} = {
  apikey: apiKey,
  network: Network.ETH_MAINNET,
}
const alchemy: Alchemy = new Alchemy(settings);

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
  const [returnedTokenData, setReturnedTokenData ] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const watchUniswapForPools = async () => {
    uniswapContact.on('PoolCreated', (token0, token1, fee, tickSpacing, pool) => {
      const newPoolData: PoolCreated = {
        token0,
        token1,
        fee,
        tickSpacing,
        pool,
      };
      setPoolData([newPoolData])

      console.log(`New pool create at ${pool} with ${token0} and ${token1}`)
    })
  };

  async function fetchTokenBalances (poolAddress: string): Promise<TokenBalance[]> {
    const balances = await alchemy.core.getTokenBalances(poolAddress);
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== '0';
    })

    let i = 1;
    let tokenBalances: TokenBalance[] = [];

    for (let token of nonZeroBalances) {
      let balance: number | string | null = token.tokenBalance;
  
      const metadata: TokenMetadataResponse = await alchemy.core.getTokenMetadata(token.contractAddress);

      if (typeof balance === 'string') {
        balance = Number(balance);
      }
      if (metadata.decimals !== null) {
        balance = balance as number / Math.pow(10, metadata.decimals);
        balance = balance.toFixed(4);
      }

      tokenBalances.push({
        index: `${i}`,
        name: metadata.name,
        balance: `${balance} ${metadata.symbol}`
      })

      console.log(`${i++}. ${metadata.name}: ${balance} ${metadata.symbol}`);
    }
    setReturnedTokenData(tokenBalances);

    return tokenBalances;
  };

  useEffect(() => {
    watchUniswapForPools();
  }, []);
  
  useEffect(() => {
    if (poolData.length > 0) {
      fetchTokenBalances(poolData[0]?.pool)
        .finally(() => setIsLoading(false));
    }
  }, [poolData]);

  return (
    <>
      <Header />

      <div className="w-[60%] min-w-[560px] bg-blue-900 text-white h-[50vh] max-h-[460px] min-h-[400px] pt-10 mt-10 justify-center mx-auto my-0">
        <p className='justify-self-center text-center text-xl border-b border-b-white pb-6'>
          Newly Created Pools will be displayed here.
        </p>
        {isLoading && (
          <div className='pt-36 w-[80%] mx-auto my-0'>
            <LinearProgress color="primary" />
          </div>
        )}
        {poolData.length > 0 && (
          <div className="px-12 pt-10 justify-self-center text-center">
            {poolData.map((data) => (
              <div>
                <strong>Pool Address: </strong>
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
        <div className="flex flex-col items-left md:w-[50%] w-[60%] mx-auto my-0 pt-10 md:pl-5">
          {returnedTokenData.map((token, index) => (
            <p key={index} className="pt-1">
              {token.index}. <strong>{token.name}</strong>: {token.balance}
            </p>
          ))}
        </div>
      </div>
    </>
  )
}
