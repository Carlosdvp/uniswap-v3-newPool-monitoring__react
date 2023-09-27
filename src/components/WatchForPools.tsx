import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNewPoolData } from '../store/newPoolDataSlice';
import { RootState } from '../store';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
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
  pool: string;
}

const ETH_MAINNET = import.meta.env.VITE_MAIN_NET_URL;

/* Contracts and Global Variables */
const factoryAbi = IUniswapV3Factory.abi;
const uniswapFactoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const provider = new ethers.JsonRpcProvider(ETH_MAINNET);
const uniswapContact = new ethers.BaseContract(uniswapFactoryAddress, factoryAbi, provider);

export const WatchForPools = () => {
  const [returnedTokenData, setReturnedTokenData ] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWatching, setIsWatching] = useState<boolean>(false); 

  const dispatch = useDispatch();
  
  const newPoolData = useSelector((state: RootState) => state.newPoolData.data);

  const watchUniswapForPools = async () => {
    uniswapContact.on('PoolCreated', (token0, token1, _fee, _tickSpacing, pool) => {
      const newPoolData: PoolCreated = {
        token0,
        token1,
        pool,
      };

      dispatch(setNewPoolData([newPoolData]));
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

  const toggleWatcher = async () => {
    if (isWatching) {
      await uniswapContact.removeAllListeners('PoolCreated');
    } else {
      watchUniswapForPools();
    }
    setIsWatching(!isWatching);
  }
  
  useEffect(() => {
    if (newPoolData.length > 0) {
      fetchTokenBalances(newPoolData[0]?.pool)
        .finally(() => setIsLoading(false));
    }
  }, [newPoolData]);

  return (
    <>
      <Header />

      <div className="w-[60%] min-w-[560px] bg-blue-900 text-white h-[50vh] max-h-[460px] min-h-[400px] pt-10 mt-10 justify-center mx-auto my-0">
        <p className='justify-self-center text-center text-xl border-b border-b-white pb-6'>
          Newly Created Pools will be displayed here.
        </p>
        <div className='text-center pt-6'>
          <Button onClick={toggleWatcher} variant="contained" color='info'>
            {isWatching ? 'Stop Watching' : 'Start Watching'}
          </Button>
        </div>
        {isLoading && isWatching && (
          <div className='pt-36 w-[80%] mx-auto my-0'>
            <LinearProgress color="primary" />
          </div>
        )}
        {newPoolData.length > 0 && (
          <div className="px-12 pt-10 justify-self-center text-center">
            {newPoolData.map((data, index) => (
              <div key={index}>
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
