import { useState } from 'react'
import { Alchemy, Network, TokenMetadataResponse } from 'alchemy-sdk'
import CircularProgress from '@mui/material/CircularProgress';
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

export const TokenBalances = () => {

  const [address, setAddress ] = useState<string>('');
  const [poolAddress, setPoolAddress ] = useState<string>('');
  const [returnedTokenData, setReturnedTokenData ] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function fetchTokenBalances (address: string): Promise<TokenBalance[]> {
    const balances = await alchemy.core.getTokenBalances(address)
  
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== '0';
    })
  
    let i = 1;
    let tokenBalances: TokenBalance[] = [];
  
    for (let token of nonZeroBalances) {
      let balance: number | string | null = token.tokenBalance;
  
      const metadata: TokenMetadataResponse = await alchemy.core.getTokenMetadata(token.contractAddress);
  
      // compute token balance in human readable format
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
        <div className="flex flex-col items-left md:w-[50%] w-[60%] mx-auto my-0 pt-10 md:pl-5">
          {isLoading && (
            <CircularProgress color="secondary" />
          )}
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
