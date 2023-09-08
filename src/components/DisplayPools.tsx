import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import IUniswapV3Factory from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json'
import Header from "./Header"

interface EventDetails {
  txHash: string; 
  token0: string; 
  token1: string; 
  poolAddress: string;
}

const ETH_MAINNET = import.meta.env.VITE_MAIN_NET_URL;

/* Contracts and Global Variables */
const factoryAbi = IUniswapV3Factory.abi;
const uniswapFactoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const provider = new ethers.JsonRpcProvider(ETH_MAINNET);
const uniswapContact = new ethers.BaseContract(uniswapFactoryAddress, factoryAbi, provider);

const DisplayPools = () => {
  const [fromBlock, setFromBlock] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [poolData, setPoolData] = useState<EventDetails[]>([]);
  const [resetCount, setResetCount] = useState<boolean>(false);

  const displayPoolAddresses = async (fromBlock: number) => {
    let eventDetails: EventDetails[] = [];
  
    try {
      const events: (ethers.Log | ethers.EventLog)[] = await uniswapContact.queryFilter("PoolCreated", fromBlock);
  
      events.forEach((event) => {
        const txHash = event.transactionHash;
        let token0, token1, poolAddress;
  
        if ('args' in event) {
          token0 = event.args[0];
          token1 = event.args[1];
          poolAddress = event.args[4]
        }
  
        const individualEventDetails: EventDetails = {
          txHash,
          token0,
          token1,
          poolAddress,
        }
        eventDetails.push(individualEventDetails)
      }) 
    } catch (error) {
      console.error("Unable to get Events", error)
    }

    return eventDetails;
  }

  const handleNextButtonClick = () => {
    setStartIndex(prevIndex => prevIndex + 10);
  };

  const handleResetButtonClick = () => {
    setStartIndex(0);
    setResetCount(true);
  }

  function displayPools(data: EventDetails[], startIndex: number) {
    return data.slice(startIndex, startIndex + 10).map((pool, index) => (
      <div key={index} className='flex'>
        <span className='mr-4 p-1'>
          Pool Address {startIndex + index + 1}:
        </span>
        <a
          href={`https://etherscan.io/address/${pool.poolAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className='hover:text-blue-400 w-[70%] text-right'>
          {pool.poolAddress}
        </a>
      </div>
    ));
  }

  const getPoolData = async () => {
    const data = await displayPoolAddresses(fromBlock)
    console.log('data button: ', data)
    displayPools(data, startIndex)

    setPoolData(data);
    setStartIndex((prevIndex) => prevIndex + 10);
  }

  useEffect(() => {
    if (resetCount) {
      setStartIndex(0);
      setResetCount(false);
    }
  }, [resetCount])
  
  return (
    <>
    <Header />

    <div>
      <h1 className='text-red-900 font-semibold text-3xl text-center py-12'>
        Recently Created Pools on Uniswap V3
      </h1>

      <div className="flex flex-col items-center">
        <p className='pb-4'>
          To fetch the Recent Pool Created events, enter a value for the <i>fromBlock</i>, the <i>toBlock</i> will be the 'latest' block.
        </p>
        <input
          type="number"
          value={fromBlock}
          onChange={(e) => setFromBlock(Number(e.target.value))}
          placeholder="from block"
          className="mb-6 px-2 py-1 w-[20%] text-black"
        />
        <button
          onClick={getPoolData}
          className="bg-blue-400 text-white px-6 py-2 hover:bg-white hover:text-black">
          Get Data
        </button>
      </div>

      <div className='p-6'>
        <p className='py-6 pl-4 bg-slate-200'>
          Number of Pools Created since block <strong>{fromBlock} :</strong> 
          <span className='text-blue-800 font-bold pl-6 text-xl'>{poolData.length}</span>
        </p>
        {displayPools(poolData, startIndex)}
      </div>

      <div className='flex flex-row w-[50%] items-center py-6 mx-auto my-0 border-2 border-slate-600'>
        <div className='flex flex-col w-[50%] items-center'>
          <label className='mb-2'>
            Show next 10 Transactions
          </label>
          <button
            className='bg-slate-600 text-white hover:bg-slate-200 hover:text-slate-700 py-2 px-4 border border-red-950 rounded-md w-[50%]'
            onClick={handleNextButtonClick}>
            Next 10
          </button>  
        </div>
        <div className='flex flex-col w-[45%] items-center'>
          <label className='mb-2'>
            Reset Transactions Display
          </label>
          <button
            className='bg-slate-600 text-white hover:bg-slate-200 hover:text-slate-700 py-2 px-4 border border-red-950 rounded-md w-[50%]'
            onClick={handleResetButtonClick}>
            Reset
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default DisplayPools
