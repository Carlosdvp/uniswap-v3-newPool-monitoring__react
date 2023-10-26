import { useState } from 'react'
import { ethers } from 'ethers'
import { abi } from '@openzeppelin/contracts/build/contracts/ERC20.json'
import CircularProgress from '@mui/material/CircularProgress';
import Header from './Header';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const { 
  VITE_MAIN_NET_URL 
} = import.meta.env;

/* Contracts and Global Variables */
const ERC20Abi = abi;
const provider = new ethers.JsonRpcProvider(VITE_MAIN_NET_URL);

interface EventDetails {
  txHash: string; 
  token0: string; 
  token1: string; 
  poolAddress: string;
}

export interface TokenBalance {
  index: string;
  name: string | null;
  balance: string;
}

export const TokenBalances = () => {

  const [address, setAddress ] = useState<string>('');
  const [poolAddress, setPoolAddress ] = useState<string>('');
  const [returnedTokenData, setReturnedTokenData ] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const savedPoolData = useSelector((state: RootState) => state.poolData.data);


  async function fetchTokenBalances (address: string): Promise<TokenBalance[]> {
    // try {
      
    // } catch (error) {
    //   console.error('Unable to fetch Token data from this pool: ${poolAddress}', error)
    // }
    let tokenBalances: TokenBalance[] = [];
    const pool = savedPoolData.find((savedPool) => savedPool.poolAddress === address);

    if (pool) {
      const { token0, token1, poolAddress } = pool;
      const tokenAddresses = [token0, token1];

      for (let i = 0; i < tokenAddresses.length; i++) {
        const tokenAddress = tokenAddresses[i];
        // Initialize the token contracts
        const tokenContract = new ethers.Contract(tokenAddress, ERC20Abi, provider);
        
        // Get token metadata
        const tokenName = await tokenContract.name();
        const tokenSymbol = await tokenContract.symbol();
        const tokenDecimals = await tokenContract.decimals();
        
        let balance = await tokenContract.balanceOf(poolAddress);
        let formattedBalance = ethers.formatUnits(balance, Number(tokenDecimals));
      
        tokenBalances.push({
          index: `${i + 1}`,
          name: tokenName,
          balance: `${formattedBalance} ${tokenSymbol}`
        });
      }
    }
    console.log('fetchTokenBalances - final answer: ', tokenBalances)
    
    setIsLoading(false);
  
    return tokenBalances;
  }

  const fetchPoolData = async () => {
    try {
      const data = await fetchTokenBalances(address);
      setPoolAddress(address);
      setAddress('');
      setReturnedTokenData(data);
    } catch (error) {
      console.error('Unable to fetch Pool Information: ', error)
    }
  }

  return (
    <>
      <Header />

      <div className="w-[60%] min-w-[560px] bg-blue-900 text-white h-[50vh] max-h-[460px] min-h-[400px] pt-10 mt-10 justify-center mx-auto my-0">
        <div className="flex flex-col items-center">
          <label className="text-lg mb-8">
            Enter a Pool Address to get the Token Balances
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value) }
            placeholder="address: 0x1...0"
            className="mb-6 px-2 py-1 w-[60%] text-black"
          />
          <button
            onClick={() => {
              setIsLoading(true);
              fetchPoolData();
            }}
            className="bg-blue-400 text-white px-6 py-2 hover:bg-white hover:text-black">
            Get Data
          </button>
        </div>
        {poolAddress && (
          <p className="px-12 pt-10 justify-self-center text-center">
            <strong>Pool Address: </strong>
            <a
              href={`https://etherscan.io/address/${poolAddress}`}
              target="_blank"
              className="hover:text-blue-300">
              {poolAddress}
            </a>
          </p>
        )}
        
        {isLoading && (
          <div className='flex justify-center pt-12'>
            <CircularProgress color="inherit" />
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
