import { ethers } from "ethers";
import axios from "axios";
const url =
  "https://api.bscscan.com/api?module=account&action=txlist&address=0x45c54210128a065de780C4B0Df3d16664f7f859e&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=22WN293I44ACISW4Y5ZFZ5RMPZMVBXK3QM";

export const fetchTx = async () => {
  await axios
    .get(url)
    .then((response) => {
      console.log(response.data.result[4].input);
      console.log(
        ethers.utils.defaultAbiCoder.decode(
          ["uint256", "address"],
          response.data.result[0].input
        )
      );
    })
    .catch((error) => {
      console.log(error.message);
    });
};
