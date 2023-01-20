import { ethers, utils } from "ethers";
const rpcurl = "https://bsc-dataseed.binance.org/";
import Values from "../contract/values.json";

const getAmount = (logs, method, user) => {
  let amount;

  var fn;
  // return 0;
  // console.log(method);
  if (method === "deposit") {
    fn = "Deposit(address,uint256,uint256,uint256,uint256)";
    const val = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(fn));
    logs.map((item) => {
      if (val.toLowerCase() === item.topics[0].toLowerCase()) {
        amount = ethers.utils.formatEther(
          ethers.utils.defaultAbiCoder.decode(["uint256"], item.data)[0]
        );
      }
    });
    return amount;
    // } else if (method === "withdrawByAmount") {
    //   fn = "Withdraw(address, uint256, uint256)"; // to user 1st
  } else if (
    method === "withdrawAll" ||
    method === "withdrawByAmount" ||
    method === "withdraw"
  ) {
    fn = "Withdraw(address,uint256,uint256)";
    const val = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(fn));
    logs.map((item) => {
      const temp = ethers.utils.defaultAbiCoder.decode(
        ["address"],
        item.topics[1]
      )[0];
      if (
        val.toLowerCase() === item.topics[0].toLowerCase() &&
        temp.toLowerCase() === user.toLowerCase()
      ) {
        amount = ethers.utils.formatEther(
          ethers.utils.defaultAbiCoder.decode(["uint256"], item.data)[0]
        );
      }
    });
    return amount;
  } else if (method === "unlock") {
    fn = "Transfer(address,address,uint256)"; // contract
    const val = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(fn));
    logs.map((item) => {
      if (item.topics.length !== 3) return;
      const temp = ethers.utils.defaultAbiCoder.decode(
        ["address"],
        item.topics[2]
      )[0];
      if (
        val.toLowerCase() === item.topics[0].toLowerCase() &&
        temp.toLowerCase() === Values.stackingaddress.toLowerCase()
      ) {
        amount = ethers.utils.formatEther(
          ethers.utils.defaultAbiCoder.decode(["uint256"], item.data)[0]
        );
      }
    });
    return amount;
  } else {
    fn = "Transfer(address,address,uint256)";
    const val = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(fn));
    logs.map((item) => {
      if (item.topics.length !== 3) return;
      const temp = ethers.utils.defaultAbiCoder.decode(
        ["address"],
        item.topics[2]
      )[0];
      if (
        val.toLowerCase() === item.topics[0].toLowerCase() &&
        temp.toLowerCase() === user.toLowerCase()
      ) {
        amount = ethers.utils.formatEther(
          ethers.utils.defaultAbiCoder.decode(["uint256"], item.data)[0]
        );
      }
    });
  }

  return amount;
};

const getLockTime = (logs, method) => {
  let lockTime;
  if (method !== "deposit") {
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
  } else {
    const val = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(
        "Deposit(address,uint256,uint256,uint256,uint256)"
      )
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
  }

  let a = Math.floor(lockTime / 3600 / 24);
  let weeks = 0;
  let days = 0;
  let years = 0;
  years = Math.floor(a / 365);
  if (a % 365) {
    weeks = Math.floor((a % 365) / 7);
    if ((a % 365) % 7) {
      days = Math.floor((a % 365) % 7);
    }
  }
  let total = "";
  if (years) {
    total += years + " years ";
  }
  if (weeks) {
    total += weeks + " weeks ";
  }
  if (days) {
    total += days + " days ";
  }

  console.log(total);
  return total;
};

export const decoder = async (tx) => {
  let provider_ = new ethers.providers.JsonRpcProvider(rpcurl);
  const recipt = await provider_.getTransactionReceipt(tx.hash);
  // console.log(tx.account);
  var amount = getAmount(recipt.logs, tx.action, tx.account);
  // console.log(recipt.logs, tx);

  var lockTime = getLockTime(recipt.logs, tx.action);
  return { amount: amount, lockTime: lockTime };
  //   console.log(recipt);
};
