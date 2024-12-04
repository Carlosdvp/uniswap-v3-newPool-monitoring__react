# Uniswap Monitoring App

## Overview

This is a React + TypeScript + Vite application designed to monitor and interact with Uniswap V3 pools. The app provides functionalities to find newly created pools, view token balances, and watch for new pool creations in real-time.

### Tech Stack

- **React**
- **Redux**
- **React Router**
- **TypeScript**
- **Vite**
- **Ethers.js**
- **Alchemy-sdk**
- **TailwindCSS**

## Pages

### 1. Home
- Provides basic instructions for using the app.

### 2. Find Pools
- Displays the current block number.
- Allows users to input a block number to find newly created Uniswap pools from that block to the present.
- Lists pool addresses in batches of 10, with pagination.
- Data persists across page navigations.

### 3. Token Balances
- Allows users to input a pool contract address to retrieve token pair information (names, symbols, and balances).

### 4. Watch for Pools
- Monitors the Uniswap V3 factory contract in real-time.
- Displays newly created pool addresses and associated token addresses.
- Future enhancements may include displaying token metadata and balances once liquidity is added.

## Project Development Details

### Version 2
- Initial functionality implemented in the Token Balances page.
- Find Pools page returns newly created Uniswap V3 pools based on a user-input block number.
- Home page provides basic app instructions.

### Version 3
- Implemented state management for data persistence using Redux.
- User inputs and retrieved pool data are stored in the Redux store, ensuring data visibility across page navigations.

### Version 4
- Improved styling uniformity across the app.
- Added a display for the current block number, updating every 30 seconds.

### Version 5 (Current)
- Added the Watch for Pools page to monitor and display newly created pools in real-time.
- Currently displays pool and token addresses.
- Future enhancements include displaying token metadata and balances once liquidity is added.

## Installation and Running the App

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build the app for production:**
   ```bash
   npm run build
   ```

## Bug Fixes
- Fixed an issue with AWS Amplify deployment by updating the configuration file to use the correct HTML file.
