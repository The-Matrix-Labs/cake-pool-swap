import { ethers, utils } from "ethers";
const rpcurl = "https://bsc-dataseed.binance.org/";

const getAmount = (logs) => {
  let amount;
  const val = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("Transfer(address,address,uint256)")
  );
  logs.map((item) => {
    if (val.toLowerCase() === item.topics[0].toLowerCase()) {
      amount = ethers.utils.formatEther(
        ethers.utils.defaultAbiCoder.decode(["uint256"], item.data)[0]
      );
    }
  });
  return amount;
};

const getLockTime = (logs) => {
  let lockTime;
  const val = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("Lock(address,uint256,uint256,uint256,uint256)")
  );
  logs.map((item) => {
    if (val.toLowerCase() === item.topics[0].toLowerCase()) {
      lockTime = parseInt(
        ethers.utils.defaultAbiCoder.decode(
          ["uint256"],
          "0x" + item.data.slice(2 + 128, 2 + 192)
        )[0]
      );
    }
  });
  return lockTime;
};

export const decoder = async (hash) => {
  let provider_ = new ethers.providers.JsonRpcProvider(rpcurl);
  const recipt = await provider_.getTransactionReceipt(hash);

  var amount = getAmount(recipt.logs);
  var lockTime = getLockTime(recipt.logs);
  return { amount: amount, lockTime: lockTime };
  //   console.log(recipt);
};
