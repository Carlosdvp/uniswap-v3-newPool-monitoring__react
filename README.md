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