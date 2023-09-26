# Uniswap Monitoring App

## React + TypeScript + Vite App

Tech Stack:
    - React
    - Redux
    - React Router
    - Typescript
    - Vite
    - Ethers.js
    - Alchemy-sdk
    - TailwindCSS

The App consists of 4 pages:
    - Home
        - Here we see some basic intructions for using the dApp
    - Find Pools
        - This page provides the user with the current block number
        - This can be used as a reference to select a block in the past and get all the newly created pools on Uniswap from that block to the present
        - Each Pool's address is a link that takes the user to etherscan
        - If there are more than 10 pools the user can view them in batches of 10, and at any time it is possible to go back to the beginning
        - This data will persist even after navigating to another page and back again

    - Token Balances
        - A user takes a pool contract address and enters it on the input field on this page
        - This will get the token pair information for the Pool
        - That is, the token names, symbols and balances

    - Watch for Pools (Currently under development)
        - This page starts watching the Uniswap V3 factory contract in real time
        - Once a new Pool created event is emitted the corresponding Pool data will be displayed on the page
        - Keep in mind that Pools are not created all the time, so it may take a while before a new pool is created.



--------------------------------------------------------------------------------------------------------------------

# Project Development DEtails are included below

## Version 2

Now the app has three pages:
    - Home
    - Find Pools
    - Token Balances

The initial functionality is now in the Token Balances page.

The Find Pools page will return all the newly creeated Pools on Uniswap V3 using an input fromBlock.

Each returned Pool Address will be listed on the page 10 at a time.

The Home page gives the user some basic instructions and information about the app.

## Version 3

Implement state management for data persistence.

App now does the following:
    - when a user enters a block number in the input field this data is saved in the store
    - when the Get Data button is clicked the pool data is saved to a Redux store
    - data displayed now stays visible when we navigate to another page and then back again.

## Version 4 

- make the styling look more uniform across the app
- add a display for the current block, it will update every 30 seconds
- this will make it easier to get a block number to get started with the information gathering

## Bug Fixed

- for some weird reason it appears that AWS Amplify is using the wrong html file for the deployment of the application.

- Had to make a small change to the AWS Amplify configuration file
- add "dist/" to the baseDirectory parameter.

-----------------------------------------------------------------------------

## Version 5 -- Current version

Added a new page: Watch for Pools

This page watches the Uniswap V3 Factory in real time and captures the data emiited by the PoolCreated event.

This data is then displayed on the page, currently that is:
    - the pool address
    - the token0 address
    - the token1 address

I was thinking I could also add the logic to display token balances, but upon closer examination I see that this will not work at this time.

Why? Well because while we capture the PoolCreated event, the liquidity may not be added right away. So if I want to display the pool's token data I may not get anything back at the moment we capture that event.

We have a few options here:

  1. Only display the pool and token addresses.
      - the user can then do with that information as they wish
  2. Display the pool and token addresses and the token metadata [symbol, name and balance].
      - add the token data to the store
      - create a new slice and incormporate in the new component.
  3. Same as option 2 but without the token balances.
      - Implement a method to activate a listener to watch for the liquidity.
      - Once there is liquidity in the pool, we display the token balances.
      - And a message stating that the Pool now has Liquidity.

For the time being I will use these options as a mini Roadmap. Option 1 is already implemented.
Next, I will implement the logic for option 2.
The 3rd option might require more work, so I will leave that for a future feature upgrade. It will not be part of the current feature being worked on for this version.


--------------------------------------------------------------------------------

### Features and Upgrades for the current version

- Add a 'Loading' spinner indicator to the Token Balances and Watch for Pools pages

- Add a slice for the Token Balances data to the Redux store, it would be nice if the data here also had some persistence.