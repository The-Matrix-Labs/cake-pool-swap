import { ethers } from "ethers";
import axios from "axios";
import { stakingAbi } from "../contract";
import Values from "../contract/values.json";

const url =
  "https://api.bscscan.com/api?module=account&action=txlist&address=0x45c54210128a065de780C4B0Df3d16664f7f859e&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=22WN293I44ACISW4Y5ZFZ5RMPZMVBXK3QM";

export const fetchTx = async () => {
  let rpcUrl = Values.rpcURl;
  let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
  let stake_temp = new ethers.Contract(
    Values.stackingaddress,
    stakingAbi,
    provider_
  );

  const pages = [];
  var txList = [];
  await axios
    .get(url)
    .then((response) => {
      console.log(response.data);
      response.data.result.map((data) => {
        var account =
          data.to != Values.stackingaddress.toLocaleLowerCase()
            ? data.to
            : data.from;
        var temp = {
          account: account,
          input: data.input,
          hash: data.hash,
          action: data.functionName.split("(")[0],
          time: data.timeStamp,
        };
        txList.push(temp);
        if (txList.length === 10) {
          pages.push(txList);
          txList = [];
        }
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
  // console.log(txList);
  return pages;
};