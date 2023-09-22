# Uniswap Monitoring App

## React + TypeScript + Vite App

The application in its current form obtains the tokens with their balances for a specific pool after the user proviedes a contract address.

Instructions for it's use:
  - the user enters a Pool address in the input field
  - clicking on the button we fetch the data from the Ethereum mainnet
  - and then it displays the following data on the screen:
      - Pool address
      - Token names
      - Token balances
      - Token symbols


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
  3. Same as option 2 but without the token balances.
      - Implement a method to activate a listener to watch for the liquidity.
      - Once there is liquidity in the pool, we display the token balances.
      - And a message stating that the Pool now has Liquidity.

For the time being I will use these options as a mini Roadmap. Option 1 is already implemented.
Next, I will implement the logic for option 2.
The 3rd option might require more work, so I will leave that for a future feature upgrade. It will not be part of the current feature being worked on for this version.