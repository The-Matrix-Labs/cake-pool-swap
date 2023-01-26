import { ethers, FixedNumber } from "ethers";
import axios from "axios";
import { stakingAbi } from "../contract";
import Values from "../contract/values.json";
import { decoder } from "./decode";

const url =
  "https://api.bscscan.com/api?module=account&action=txlist&address=0x45c54210128a065de780C4B0Df3d16664f7f859e&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=22WN293I44ACISW4Y5ZFZ5RMPZMVBXK3QM";

const format = (seconds) => {
  seconds = seconds / 1000;
  // day, h, m and s
  var days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * (24 * 60 * 60);
  var hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * (60 * 60);
  var minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  var t = Array();
  if (0 < days) {
    t.push(Math.floor(days) + " day");
  }
  if (0 < hours) {
    t.push(Math.floor(hours) + " hr");
  }
  if (0 < minutes) {
    t.push(Math.floor(minutes) + " m");
  }
  if (0 < seconds) {
    t.push(Math.floor(seconds) + " s");
  }
  if (t.length > 1) {
    t[0] + "," + t[1];
  }
  return t[0];
};

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
  try {
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
            time: format(new Date().getTime() - data.timeStamp * 1000),
            hoverTime: new Date(data.timeStamp * 1000).toLocaleTimeString(
              "en-US"
            ),
            decoded: false,
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
  } catch (error) {}
  // console.log(txList);

  // const fn = async () => {
  //   pages.forEach((page) => {
  //     page.forEach(async (tx) => {
  //       var res = await decoder(tx);
  //       tx.amount = Math.floor(res.amount * 100) / 100 || 0;
  //       tx.locktime = res.lockTime || 0;
  //     });
  //   });
  // };

  // try {
  //   await fn();
  // } catch (error) {}

  return pages || [[]];
};
