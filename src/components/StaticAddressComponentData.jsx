import React, { useState, useRef, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  discord,
  logo,
  reddit,
  telegram,
  twitter,
  lock,
  arrow,
  metamask,
  bscScan,
  close,
  menu,
  arrowDown,
  leftArrow,
  rightArrow,
  lock1,
  logo_top,
  unlock,
  new_arrow,
} from "../assets";
import { useSigner, useProvider } from "wagmi";
import { ethers } from "ethers";
import Values from "../contract/values.json";
import { tokenAbi, stakingAbi } from "../contract";
import { fetchTx } from "./fetchTx";
import { decoder } from "./decode";
// import { priceFinder } from "./priceFinder";
import {
  // searchPairsMatchingQuery,
  searchPairsMatchingQuery,
} from "dexscreener-api";

import { Number, NumberFloat } from "./Number";



export default function StaticAddressComponentData(props) {
    // console.log(props.address);
  const [totalStaked, setTotalStaked] = useState(0);
  const [totalLocked, setTotalLocked] = useState(0);
  const [lockDuration, setLockDuration] = useState("0");
  const [unlockTime, setUnlockTime] = useState("-");
  const [isLocked, setIsLocked] = useState();
  const [amountLocked, setAmountLocked] = useState(0);
  const [boostYield, setBoostYield] = useState(0);
  const [amountProfited, setAmountProfited] = useState(0);
  const [avgLockDuration, setAvgLockDuration] = useState();
  const { data: signer, isError, isLoading } = useSigner();
  const provider = useProvider();
  // const [show, setShow] = useState(true);
  const [colList, setColList] = useState([
    "Hash",
    "Account",
    "Action",
    "Time",
    "Amount",
    "USD",
    "LockTime",
  ]);
  const [activeCol, setActiveCol] = useState(0);
  const [colListSmall, setColListSmall] = useState(["Hash", "Account"]);
  const [dropDown, setDropDown] = useState(false);
  const [userAddress, setUserAddress] = useState(props.address);

  const [options, setOptions] = useState([
    "Action",
    "Time",
    "Amount",
    "USD",
    "LockTime",
  ]);
  const [txlist, setTxList] = useState([]);
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [usdPrice, setUsdPrice] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {}, [activeCol]);

  // let usdPrice = priceFinder();
  // console.log(usdPrice);

  const priceFinder = async () => {
    // Get pairs matching base token address
    // const tokensResponse = await getPairsMatchingBaseTokenAddress(
    //   "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
    // );
    const searchResponse = await searchPairsMatchingQuery("CAKE USDT");
    const val = searchResponse.pairs?.find(
      (data) => data.dexId === "pancakeswap"
    );
    // console.log(val.priceUsd);
    setUsdPrice(val.priceUsd || 0);
  };

  useEffect(() => {
    getPoolInfo();
    getUserInfo();
    priceFinder();
  }, [signer, userAddress]);

  const fetchData = () => {
    getPoolInfo();
    getUserInfo();
    priceFinder();
  };

  const fetchPages = async () => {
    if (page === 0) {
      var temp = await fetchTx();
      // console.log(temp);
      setPages(temp);
    }
  };

  useEffect(() => {
    const myInterval = setInterval(fetchData, 2000);

    return () => {
      // should clear the interval when the component unmounts
      clearInterval(myInterval);
    };
  }, []);

  useEffect(() => {
    const myInterval = setInterval(fetchPages, 20000);

    return () => {
      // should clear the interval when the component unmounts
      clearInterval(myInterval);
    };
  }, [pages]);

  useEffect(() => {}, [usdPrice]);

  const handleTxDecode = async () => {
    if (pages.length <= page) return;
    let temp = await Promise.all(
      pages[page].map(async (tx) => {
        if (tx.decoded) return tx;
        var res = await decoder(tx);

        return {
          ...tx,
          amount: Math.floor(res.amount * 100) / 100 || 0,
          locktime: res.lockTime || 0,
          decoded: true,
          usd: (
            Math.floor(res.amount * usdPrice * 100) / 100 || 0
          ).toLocaleString(),
        };
      })
    );
    setTxList(temp);
  };

  useEffect(() => {
    const fn = async () => {
      var temp = await fetchTx();
      setPages(temp);

      temp[page].forEach(async (tx) => {
        if (tx.decoded) return;
        var res = await decoder(tx);
        tx.amount = Math.floor(res.amount * 100) / 100 || 0;
        tx.locktime = res.lockTime || 0;
        tx.decoded = true;
        tx.usd = Math.floor(res.amount * usdPrice * 100) / 100 || 0;
      });
      setTxList(temp[page]);
      // temp.forEach((tx) => {
      //   txlist.push(tx);
      // });
    };
    fn();
  }, []);

  const handleChangeUp = async () => {
    // console.log("up");
    if (pages.length > page + 1) {
      var temp = page + 1;
      setPage(temp);
      setPageNumber(temp + 1);
      setTxList(pages[temp]);
    }
  };

  const handleChangeDown = () => {
    if (page > 0) {
      var temp = page - 1;
      setPage(temp);
      setPageNumber(temp + 1);
      setTxList(pages[temp]);
    }
  };

  const handleCustomChange = (event) => {
    event.preventDefault();
    // console.log("here it comes");
    var val = parseInt(event.target.value);
    if (val === "") {
      setPage(0);
      setPageNumber(null);
    }
    if (parseInt(val) < pages.length) {
      setPage(val - 1);
      // console.log(val, "8888888888888888888888888888");
      setPageNumber(val);
      setTxList(pages[val]);
    }
  };

  useEffect(() => {}, [pages]);

  useEffect(() => {
    const fn = async () => {
      await priceFinder();
    };
    fn();
  });

  useEffect(() => {
    handleTxDecode();
    // console.log(page);
  }, [page, pages, pageNumber]);

  useEffect(() => {
    // console.log(txlist);
  }, [txlist]);

  const getPoolInfo = async () => {
    let rpcUrl = Values.rpcURl;
    let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
    let stake_temp = new ethers.Contract(
      Values.stackingaddress,
      stakingAbi,
      provider_
    );

    var available = ethers.utils.formatEther(await stake_temp.available());
    var locked = ethers.utils.formatEther(await stake_temp.totalLockedAmount());
    var maxDuration = parseInt(await stake_temp.MAX_LOCK_DURATION());
    var minDuration = parseInt(await stake_temp.MIN_LOCK_DURATION());

    // console.log(maxDuration, minDuration);

    setAvgLockDuration((maxDuration - minDuration) / 2 / 86400 / 7);
    setTotalStaked(Math.floor(available));
    setTotalLocked(Math.floor(locked));
  };

  const getUserInfo = async () => {
    // console.log("hello world");
    let rpcUrl = Values.rpcURl;
    let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
    let stake_temp = new ethers.Contract(
      Values.stackingaddress,
      stakingAbi,
      provider_
    );
    let token_temp = new ethers.Contract(
      Values.tokenAddress,
      tokenAbi,
      provider_
    );
    // console.log(token_temp);
    var userinfo = await stake_temp.userInfo(
      userAddress || signer?.getAddress()
    );
    var startTime = parseInt(userinfo.lockStartTime);
    var endTime = parseInt(userinfo.lockEndTime);
    var duration = Math.max(endTime - new Date().getTime() / 1000, 0);
    var boostedAmount = parseFloat(
      ethers.utils.formatEther(userinfo.userBoostedShare)
    );
    var amount = parseFloat(ethers.utils.formatEther(userinfo.lockedAmount));
    setLockDuration(Math.floor(duration / 86400));

    endTime = new Date(endTime * 1000);
    // console.log(amount + 1);
    setUnlockTime(endTime.toDateString() + " " + endTime.toLocaleTimeString());
    setIsLocked(duration <= 0 ? false : true);
    setAmountLocked(amount);
    var temp_yield =
      Math.floor(((amount + boostedAmount) * 100) / amount) / 100;

    var recent_profit =
      (boostedAmount *
        (Math.min(new Date().getTime() / 1000, userinfo.lockEndTime) -
          userinfo.lockStartTime)) /
      (userinfo.lockEndTime - userinfo.lockStartTime);
    // console.log(amount + boostedAmount);
    setBoostYield(temp_yield);
    setAmountProfited(recent_profit.toFixed(7));
  };

  const handleToggle = () => {
    setShow(!show);
  };

  const handleDropDown = () => {
    setDropDown(!dropDown);
  };

  useEffect(() => {}, [signer]);

  useEffect(() => {}, [show, txlist, dropDown]);

  const addToToken = async () => {
    const tokenAddress = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
    const tokenSymbol = "CAKE";
    const tokenDecimals = 18;
    const tokenImage = "";

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        // console.log("Thanks for your interest!");
      } else {
        // console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };
    return (
            <div className={`overflow-hidden  ${show ? "h-fill" : "h-0"}`}>
              <div className="flex justify-around ss:flex-row flex-col gap-y-[1rem]">
                <div className="flex ss:flex-col flex-row ss:justify-start justify-between align-center">
                  <div className="text-white items-center  font-thin flex text-[0.8rem] leading-[0.9rem] ss:mb-[1rem] ss:w-full w-[50%]">
                    CAKE locked
                  </div>
                  <div className="ss:w-full w-[50%]">
                    <div className="text-white font-bold ss:text-[2rem] text-[1.5rem] ss:leading-[1.7rem] leading-[1.3rem] mb-[10px]">
                      {(Math.floor(amountLocked * 1000) / 1000).toLocaleString()}
                    </div>
                    <div className="text-white items-center font-thin flex text-[0.8rem] leading-[0.9rem]">
                      {(
                        Math.floor(usdPrice * amountLocked * 1000) / 1000
                      ).toLocaleString()}{" "}
                      USD
                    </div>
                  </div>
                </div>
  
                <div className="flex ss:flex-col flex-row ss:justify-start justify-between">
                  <div className="text-white items-center font-thin flex text-[0.8rem] leading-[0.9rem] ss:mb-[1rem] ss:w-full w-[50%]">
                    Unlocks In
                  </div>
                  <div className="ss:w-full w-[50%]">
                    <div className="text-white font-bold ss:text-[2rem] text-[1.5rem] ss:leading-[1.7rem] leading-[1.3rem] mb-[10px]">
                      {lockDuration} Days
                    </div>
                    <div className="text-white items-center font-thin flex text-[0.8rem] leading-[0.9rem]">
                      On {unlockTime}
                    </div>
                  </div>
                </div>
                <div className="flex ss:flex-col flex-row ss:justify-start justify-between">
                  <div className="text-white items-center font-thin flex text-[0.8rem] leading-[0.9rem] ss:mb-[1rem] ss:w-full w-[50%]">
                    Yield boost
                  </div>
                  <div className="ss:w-full w-[50%]">
                    <div className="text-white font-bold ss:text-[2rem] text-[1.5rem] ss:leading-[1.7rem] leading-[1.3rem] mb-[10px] flex flex-row">
                      <NumberFloat n={boostYield || 0} /> x
                    </div>
                    <div className="text-white items-center font-thin flex text-[0.8rem] leading-[0.9rem]">
                      Lock for {Math.floor(lockDuration / 7).toLocaleString()}{" "}
                      weeks
                    </div>
                  </div>
                </div>
              </div>
            </div>
    );
}