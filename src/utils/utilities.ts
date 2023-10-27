import { ethers } from "ethers";

export async function getTokenPairData(tokenContract: ethers.Contract, poolAddress: string) {
  // Get token metadata
  const tokenName = await tokenContract.name();
  const tokenSymbol = await tokenContract.symbol();
  const tokenDecimals = await tokenContract.decimals();
  
  // Format Token Balance
  let balance = await tokenContract.balanceOf(poolAddress);
  let formattedBalance = ethers.formatUnits(balance, Number(tokenDecimals));
  let balanceToDisplay = parseFloat(formattedBalance).toFixed(5);

  return { tokenName, balanceToDisplay, tokenSymbol }
}
