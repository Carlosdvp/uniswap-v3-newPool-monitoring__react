import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IUniswapV3Factory from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json'
import Header from './Header'
import { setPoolData, setFromBlock } from '../store/poolDataSlice'
import { RootState } from '../store'

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
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [poolEventData, setPoolEventData] = useState<EventDetails[]>([]);
  const [resetCount, setResetCount] = useState<boolean>(false);
  const dispatch = useDispatch();

  const poolData = useSelector((state: RootState) => state.poolData.data);
  const fromBlock = useSelector((state: RootState) => state.poolData.fromBlock);

  const getCurrentBlock = async (): Promise<void> => {
    try {
      const currentBlock: number = await provider.getBlockNumber();
      setCurrentBlock(currentBlock);
    } catch (error) {
      console.error('Could not get current block number', error)
    }
  }
  // get latest block number when component is loaded
  useEffect(() => {
    getCurrentBlock();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(getCurrentBlock, 30000);
    // Clean up the interval when the component unmounts.
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleBlockNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const blockNumber = Number(event.target.value);
    dispatch(setFromBlock(blockNumber));
  };

  useEffect(() => {
    setPoolEventData(poolData);
  }, [poolData]);

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
      <div 
        key={index} 
        className='flex bg-blue-900 text-white my-1 justify-between min-w-[460px]'>
        <span className='py-1 pl-4'>
          Pool Address {startIndex + index + 1}:
        </span>
        <a
          href={`https://etherscan.io/address/${pool.poolAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className='hover:text-blue-400 pr-4 py-1'>
          {pool.poolAddress}
        </a>
      </div>
    ));
  }

  const getPoolData = async (): Promise<void> => {
    const data: EventDetails[] = await displayPoolAddresses(fromBlock)

    displayPools(data, startIndex)
    setPoolEventData(data);
    dispatch(setPoolData(data)); // update the store
    setStartIndex((prevIndex) => prevIndex);
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
        <h1 className='text-orange-700 font-semibold text-3xl text-center py-8'>
          Recently Created Pools on Uniswap V3
        </h1>

        <div className="flex flex-col items-center text-center w-[60%] min-w-[500px] bg-blue-900 text-white h-[25vh] max-h-[380px] min-h-[180px] justify-center mx-auto my-0">
          <p className='pb-4'>
            To fetch the Recent Pools Created, enter a value for the <i>fromBlock</i>
          </p>
          <input
            type="number"
            value={fromBlock || ''}
            onChange={handleBlockNumberChange}
            placeholder="from block"
            className="mb-4 px-2 py-1 w-[30%] text-black border border-blue-400"
          />
          <button
            onClick={getPoolData}
            className="bg-blue-400 text-white border border-blue-300 px-6 py-2 hover:bg-white hover:text-black mb-4">
            Get Data
          </button>

          <p className='py-1'>
            You can use the current block as reference:
          </p>
          <p className='text-2xl'>
            {currentBlock !== null ? currentBlock : 'Loading...'}
          </p>
        </div>

        <div className='text-center'>
          <div className='py-6 pl-4 mx-auto my-2 bg-blue-200 w-[60%] min-w-[500px]'>
            <p className='pb-2'>
              Number of Pools Created since block <strong>{fromBlock} :</strong> 
              <span className='text-blue-800 font-bold pl-6 text-xl'>{poolEventData.length}</span>
            </p>
            <p>
              Clicking on a Pool Address will take you to the Etherscan page for that contract.
            </p>
          </div>
          <div className='w-[60%] min-w-[600px] mx-auto my-0'>
            {displayPools(poolEventData, startIndex)}
          </div>
        </div>

        <div className='flex flex-row w-[60%] min-w-[500px] items-center py-6 mx-auto my-0 border-2 border-blue-600 bg-blue-900 text-white'>
          <div className='flex flex-col w-[50%] items-center'>
            <label className='mb-2'>
              Show next 10 Pools
            </label>
            <button
              className="bg-blue-400 text-white border border-blue-300 px-6 py-2 hover:bg-white hover:text-black"
              onClick={handleNextButtonClick}>
              Next 10
            </button>  
          </div>
          <div className='flex flex-col w-[45%] items-center'>
            <label className='mb-2'>
              Return to Beginning
            </label>
            <button
              className="bg-blue-400 text-white border border-blue-300 px-6 py-2 hover:bg-white hover:text-black"
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
