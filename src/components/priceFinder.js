import { ethers } from "ethers";
import routerAbi from "./router.json";
// import tokenAbi from "./token.json";

export const fn = async () => {
  // let rpcUrl = "https://bsc-dataseed1.defibit.io/";
  // let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
  // let router = new ethers.Contract(
  //   "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  //   routerAbi,
  //   provider_
  // );
  // const tokenIn = "0xc3BcE47886e56316B2A5A4b2C926561AE94039A2";
  // const tokenOut = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
  // const amountIn = "1";
  // let amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
  // let busd = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
  // let amounts2 = await router.getAmountsOut(amounts[1], [tokenOut, busd]);
  // console.log(`
  //       Buying new token
  //       =================
  //       tokenIn: ${ethers.utils.formatEther(
  //         amountIn.toString()
  //       )} ${tokenIn} (Amber)
  //       tokenOut: ${ethers.utils.formatEther(
  //         amounts2[1].toString()
  //       )} ${busd} (BUSD)
  //     `);
  // console.log(ethers.utils.formatEther(amounts2[1].toString()));
};
