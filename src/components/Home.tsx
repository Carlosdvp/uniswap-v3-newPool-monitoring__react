export const Home = () => {
  return (
    <div className='flex flex-col w-[80%] mx-auto my-8 pt-12 p-6 bg-blue-100 items-center h-full'>
      <h1 className='text-center py-8 font-semibold text-xl'>
        Uniswap V3 Monitoring App
      </h1>
      <p className='pb-6 w-[80%]'>
        The purpose of this application is to fetch data from newly created Uniswap V3 pools.
      </p>
      <p className='pb-6 w-[80%]'>
        In the <strong>Find Pools</strong> tab you can enter a block number and fetch the new pools created from that block up to the latest block on the Ethereum blockchain.
      </p>
      <p className='pb-6 w-[80%]'>
        In the <strong>Token Balances</strong> tab you can use any of the pool addresses you received and look up the tokens in those pools, you will get the token name, the symbol and the balance.
      </p>
    </div>
  )
}
