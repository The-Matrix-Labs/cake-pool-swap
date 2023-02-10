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
import StaticAddressComponent from "./StaticAddressComponent";

function Circle() {
  return (
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
  );
}

function PathCircle() {
  return (
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  );
}

function Home() {
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
  const [userAddress, setUserAddress] = useState();
  const [inputField, setInputField] = useState();

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
    console.log("hello world");
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
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-center ">
      <div className="flex w-full h-[4rem] bg-[#00A9BE] justify-between items-center p-2 ss:px-[3rem]">
        <div className="flex flex-row  align-text-center justify-center gap-x-[10px]">
          <img src={logo} />
          <div className="text-white items-center flex">Cakepool</div>
        </div>
        {/* {<ConnectButton />} */}
      </div>

      <StaticAddressComponent address="0x17927d2f8f3e60f0a396910e55477af2f499b9c4" />
      <StaticAddressComponent address="0x8324323e13c2f5fcc15cb0155fb8c8d8a676dd20" />
      <StaticAddressComponent address="0x7fe4d188f63ab5612c22e75955cdcce068399f1a" />
      <StaticAddressComponent address="0xB0Ed302D18efdE0Df7FCEd0681E89Bf7f7EaDcB6" />

      <div className="flex bg-[#035D68] rounded-xl p-6 px-[2rem] justify-around flex-row md:mx-[9rem] md:mt-[5rem] ss:mx-[2rem]  mt-[1rem] mx-[10px]">
        <div className="text-white items-center font-bold flex ">
          Wallet Address:
        </div>
        <input
          className="w-[55%] rounded-md h-[2rem] px-[12px] mr-[1rem]"
          placeholder="Address"
          value={inputField}
          onChange={(e) => {
            setInputField(e.target.value);
          }}
        />
        <button
          type="button"
          className="ss:w-[10rem] w-[4rem] bg-blue-600 rounded-md p-2"
          onClick={() => {
            setUserAddress(inputField);
          }}
        >
          Check
        </button>
      </div>
      
      <div className="flex bg-[#035D68] rounded-xl p-6 px-[2rem] md:mx-[9rem] md:mb-[5rem] ss:mx-[2rem]  my-[1rem] mx-[10px] justify-around flex-col ">
        <div className="flex w-full justify-between ss:flex-row flex-col gap-y-[0.3rem]">
          <div className="flex ss:w-[20%] w-full flex-col ss:justify-start justify-center ">
            <div className="text-white  mb-[0.5rem]">Wallet Address&nbsp;:<div className="truncate text-white">{userAddress}</div></div>
            <div className="text-white mb-[1rem] ss:text-[0.9rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem] text-gray-100/50">
              Token
            </div>
            <div className="flex flex-row  align-text-center gap-x-[10px] ss:justify-start justify-center">
              <img src={logo_top} />
              <div className="text-white items-center font-bold flex ">
                Stake CAKE
              </div>
            </div>
          </div>
          <div className="flex ss:flex-row flex-col justify-around ss:pl-[8rem] ss:w-[60%] w-full flex-wrap gap-y-[1.4rem] mt-[1.4rem] ss:mt-[0] ">
            {/* <div className="flex flex-col ss:bg-transparent  ss:w-auto w-[98%]  ss:text-start text-center ">
              <div className="text-white ss:mb-[1rem] mb-[0.5rem] ss:text-[0.9rem] text-start px-[0.7rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem] ">
                Recent profit
              </div>
              <div className="flex flex-col ss:bg-transparent bg-[#027785] ss:py-0 p-[0.7rem] rounded-md align-text-center justify-center gap-y-[1px]">
                <div className="text-white text-[1rem] leading-[1.2rem] font-thick">
                  {Math.floor(amountProfited * 100000) / 100000}
                </div>
                <div className="ss:text-white text-gray-200/50 items-center ss:justify-start justify-center font-thin flex text-[0.8rem] leading-[0.9rem] w-full">
                  Stake CAKE
                </div>
              </div>
            </div> */}
            <div className="flex  flex-col  ss:bg-transparent  ss:w-auto w-[98%]  ss:text-start text-center">
              <div className="text-white ss:mb-[1rem] mb-[0.5rem] ss:text-[0.9rem] text-start px-[0.7rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem] ">
                Locked
              </div>
              <div className="flex flex-col ss:bg-transparent bg-[#027785] ss:py-0 p-[0.7rem] rounded-md align-text-center justify-center gap-y-[1px]">
                <div className="text-white text-[1rem] leading-[1.2rem] font-thick">
                  {(Math.floor(amountLocked * 1000) / 1000).toLocaleString()}
                </div>
                <div className="ss:text-white text-gray-200/50 items-center ss:justify-start justify-center font-thin flex text-[0.8rem] leading-[0.9rem] w-full">
                  {(
                    Math.floor(usdPrice * amountLocked * 1000) / 1000
                  ).toLocaleString()}{" "}
                  USD
                </div>
              </div>
            </div>

            {/* <div className="flex  flex-col  ss:w-auto w-[48%]  ss:text-start ">
              <div className="text-white ss:mb-[1rem] mb-[0.5rem] ss:text-[0.9rem] px-[0.7rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem] text-gray-100/50">
                APR
              </div>
              <div className="flex flex-col ss:bg-transparent bg-[#027785] ss:py-0 p-[0.7rem] rounded-md align-text-center justify-center gap-y-[1px] h-full">
                <div className="text-white text-[1rem] leading-[1.2rem] font-thick  flex flex-row">
                  <NumberFloat n={48.32} />%
                </div>
              </div>
            </div> */}
            <div className="flex  flex-col ss:bg-transparent  ss:w-auto w-[98%]  ss:text-start text-center">
              <div className="text-white ss:mb-[1rem] mb-[0.5rem] text-start ss:text-[0.9rem] px-[0.7rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem]">
                Total Staked
              </div>
              <div className="flex flex-col ss:bg-transparent bg-[#027785] ss:py-0 p-[0.7rem] rounded-md align-text-center justify-center gap-y-[1px]">
                <div className="text-white text-[1rem] leading-[1.2rem] font-thick">
                  <Number n={totalStaked} />
                </div>
                <div className="ss:text-white text-gray-200/50 items-center ss:justify-start justify-center font-thin flex text-[0.8rem] leading-[0.9rem] w-full">
                  CAKE
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              handleToggle();
            }}
            className="text-[#61ECFF]  cursor-pointer ss:text-[1.5rem] text-[1.2rem] ss:leading-[1.6rem] leading-[1.4rem] ss:w-[20%] w-full ss:text-center text-end"
          >
            <div className="flex flex-row items-center ss:justify-center justify-end gap-x-[15px]">
              {show ? "Hide" : "Unhide"}
              <img
                src={arrowDown}
                alt=""
                className={`ss:w-[23px] ss:h-[23px] w-[13px] h-[13px] object-contain cursor-pointer`}
              />
            </div>
          </div>
        </div>
        {true && (
          <div className={`overflow-hidden  ${show ? "h-fill" : "h-0"}`}>
            <hr class="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-400"></hr>
            <div className="flex justify-around ss:flex-row flex-col gap-y-[1rem]">
              <div className="flex ss:flex-col flex-row ss:justify-start justify-between align-center">
                <div className="text-white items-center  font-thin flex text-[0.8rem] leading-[0.9rem] ss:mb-[1rem] ss:w-full w-[50%]">
                  Cake Locked
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

            <div className="flex ss:flex-row flex-col mt-[4rem] items-center">
              <div className="flex flex-col ss:w-[40%] w-[100%] ">
                <div className="flex flex-row mb-[0.7rem] ss:justify-start items-center ">
                  <div className="text-white text-[1rem] leading-[1.3rem] mr-[1.6rem]">
                    My Position
                  </div>
                  <div className="flex flex-row bg-[#00A9BE] rounded-md p-1">
                    <img
                      src={isLocked ? lock : unlock}
                      alt=""
                      className="fill-green-400 h-[20px] w-[20px] cursor-pointer"
                    />
                    <div className="text-white text-[1rem] leading-[1.3rem]">
                      {isLocked ? "Locked" : "Unlocked"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="text-gray-200/50 text-[1rem] leading-[1.3rem] mr-[5px]">
                    Total locked:
                  </div>
                  <div className="text-gray-200/50 text-[1rem] leading-[1.3rem] flex flex-row gap-x-[5px]">
                    <Number n={totalLocked} /> CAKE
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="text-gray-200/50 text-[0.7rem] leading-[0.9rem] mr-[5px]">
                    Average lock duration:
                  </div>
                  <div className="text-gray-200/50 text-[0.7rem] leading-[0.9rem] flex flex-row gap-x-[5px] ">
                    <Number n={Math.floor(avgLockDuration) || 0} /> weeks
                  </div>
                </div>
              </div>
              <div className="flex ss:flex-row flex-wrap-row ss:w-[70%] w-[100%] justify-around flex-wrap text-center ss:m-0 mt-[1.5rem] gap-y-[1.7rem]">
                <div
                  className="text-[#61ECFF] items-center underline decoration-[#61ECFF] ss:w-auto w-[48%] flex flex-row gap-x-[5px] cursor-pointer"
                  onClick={() => {
                    window.open(
                      "https://pancakeswap.finance/info/token/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
                    );
                  }}
                >
                  See token info
                  <img src={arrow} className="w-[20px] h-[20px]" alt="" />
                </div>
                <div
                  className="text-[#61ECFF] items-center underline decoration-[#61ECFF] ss:w-auto w-[48%] flex flex-row gap-x-[5px] pl-[6px] cursor-pointer"
                  onClick={() => {
                    window.open(
                      "https://docs.pancakeswap.finance/products/syrup-pool/new-cake-pool"
                    );
                  }}
                >
                  View tutorial
                  <img src={arrow} className="w-[20px] h-[20px]" alt="" />
                </div>
                <div
                  className="text-[#61ECFF] items-center underline decoration-[#61ECFF] ss:w-auto w-[48%] flex flex-row gap-x-[5px] cursor-pointer"
                  onClick={() => {
                    window.open(
                      "https://bscscan.com/address/0x45c54210128a065de780C4B0Df3d16664f7f859e"
                    );
                  }}
                >
                  View contract
                  <img src={bscScan} className="w-[20px] h-[20px]" alt="" />
                </div>
                <div
                  className="text-[#61ECFF] items-center underline decoration-[#61ECFF] ss:w-auto w-[48%] flex flex-row whitespace-nowrap gap-x-[5px] cursor-pointer"
                  onClick={addToToken}
                >
                  Add to Wallet
                  <img src={metamask} className="w-[22px] h-[22px]" alt="" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex ss:hidden flex bg-[#035D68] rounded-xl p-6 px-[2rem] md:mx-[9rem] md:mb-[5rem] ss:mx-[2rem]  mb-[1rem] mx-[10px] justify-around flex-col ">
        <div className="flex flex-row justify-between w-full mb-[2rem]">
          {colListSmall.map((col) => {
            return (
              <div
                className={`text-white w-1/3 font-bold ss:text-[0.8rem] text-center ss:leading-[1rem] text-[1rem] leading-[1.2rem]`}
              >
                {col}
              </div>
            );
          })}
          <div
            className={`flex flex-row gap-x-[8px] justify-end text-white w-1/3 font-bold ss:text-[0.8rem] text-center ss:leading-[1rem] text-[1rem] leading-[1.2rem]`}
          >
            {options[activeCol]}
            <div className="ss:hidden flex justify-end items-center relative">
              <img
                src={dropDown ? close : arrowDown}
                alt="menu"
                className={`w-[13px] h-[13px] object-contain curssor-pointer`}
                onClick={() => setDropDown(!dropDown)}
              />
              <div
                className={`${
                  !dropDown ? "hidden" : "flex"
                } p-6 absolute z-[99] top-5 -right-1/2 min-w-[140px] rounded-xl sidebar bg-[#027785]`}
              >
                <ul className="list-none flex justify-end items-start flex-1 flex-col">
                  {options.map((nav, index) => (
                    <li
                      key={nav}
                      className={`font-poppins font-medium cursor-pointer text-[16px] ${
                        activeCol === index
                          ? "green__gradient__text text-slate-100"
                          : "text-dimWhite"
                      } ${index === options.length - 1 ? "mb-0" : "mb-4"}`}
                      onClick={() => setActiveCol(index)}
                    >
                      <a>{nav}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {txlist.map((tx, index) => {
          return (
            <div className="z-[1] ">
              <div className="flex flex-row justify-around min-h-[1.4rem] ">
                {colListSmall.map((col) => {
                  return (
                    <div
                      className={` w-1/4 ${
                        col === "Hash" || col === "Account"
                          ? "text-[#61ECFF]/75 cursor-pointer"
                          : "text-gray-100/75"
                      } truncate text-center`}
                      onClick={() => {
                        if (col === "Hash")
                          window.open(
                            "https://bscscan.com/tx/" + tx[col.toLowerCase()]
                          );
                        else if (col === "Account") {
                          window.open(
                            "https://bscscan.com/address/" +
                              tx[col.toLowerCase()]
                          );
                        }
                      }}
                    >
                      {tx[col.toLowerCase()]}
                    </div>
                  );
                })}
                <div
                  className={` w-1/4 ${
                    options[0] === "Hash" || options[0] === "Account"
                      ? "text-[#61ECFF]/75"
                      : "text-gray-100/75"
                  } truncate text-center`}
                >
                  {tx[options[activeCol].toLowerCase()] === "" ||
                  tx[options[activeCol].toLowerCase()] === undefined ||
                  tx[options[activeCol].toLowerCase()] === null ? (
                    <svg
                      class="animate-spin h-5 w-5 mr-3 items-center text-[#61ECFF]/75 ml-[3rem]"
                      viewBox="0 0 24 24"
                    >
                      <Circle />
                      <PathCircle />
                    </svg>
                  ) : options[activeCol] === "Action" ? (
                    <div className="flex flex-row justify-center items-center">
                      <div className="mr-[0.2rem] truncate max-w-[90%]">
                        {tx[options[activeCol].toLowerCase()]}
                      </div>
                      <span
                        className={`${
                          tx[options[activeCol].toLowerCase()] === "deposit"
                            ? "dot-green"
                            : "dot-red"
                        }`}
                      ></span>
                    </div>
                  ) : options[activeCol] === "Amount" ? (
                    <div className="flex flex-row justify-center items-center">
                      <div className="mr-[0.6rem] truncate">
                        {tx[options[activeCol].toLowerCase()].toLocaleString()}
                      </div>
                    </div>
                  ) : options[activeCol] === "Time" ? (
                    <div className="">
                      <div className="parent-div truncate">
                        {" "}
                        {tx[options[activeCol].toLowerCase()]}
                      </div>
                      <div className="hover-text truncate absolute w-[80px] right-[1rem]  px-3 py-2 text-sm font-medium text-gray-900 bg-white rounded-lg shadow-sm  tooltip">
                        {tx["hoverTime"]}
                        <div
                          class="tooltip-arrow -top-[10%] left-[50%]"
                          data-popper-arrow
                        ></div>
                      </div>
                    </div>
                  ) : (
                    tx[options[activeCol].toLowerCase()]
                  )}
                </div>
              </div>
              {index !== txlist.length - 1 && (
                <hr class="w-full h-px my-4 bg-gray-500/25 border-0 dark:bg-gray-400/25"></hr>
              )}
            </div>
          );
        })}
        <div className="flex flex-row justify-end mt-[1rem]">
          <img
            src={new_arrow}
            className={`h-[20px] w-[20px] rotate-180 cursor-pointer ${
              page === 0 ? "opacity-25" : "opacity-100"
            }`}
            onClick={handleChangeDown}
          />
          <img
            src={new_arrow}
            className={`h-[20px] w-[20px] cursor-pointer ${
              page + 1 === pages.length ? "opacity-25" : "opacity-100"
            }`}
            onClick={handleChangeUp}
          />
        </div>
      </div>

      <div className="flex ss:flex hidden bg-[#035D68] rounded-xl p-6 px-[2rem] md:mx-[9rem] md:mb-[5rem] ss:mx-[2rem]  mb-[1rem] mx-[10px] justify-around flex-col ">
        <div className="flex flex-row justify-between w-full mb-[2rem]">
          {colList.map((col) => {
            return (
              <div
                className={`text-white w-1/6 font-bold ss:text-[0.8rem] text-center ss:leading-[1rem] text-[1rem] leading-[1.2rem] flex flex-row items-center justify-center`}
              >
                {col}
                {col === "Amount" ? (
                  <img
                    src={logo_top}
                    className="h-[20px] w-[20px] ml-[0.5rem]"
                  />
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>
        {txlist.map((tx, index) => {
          return (
            <div>
              <div className="flex flex-row justify-between">
                {colList.map((col) => {
                  return (
                    <div
                      className={`min-h-[1.1rem] w-1/6 ${
                        col === "Hash" || col === "Account"
                          ? "text-[#61ECFF]/75 cursor-pointer"
                          : "text-gray-100/75"
                      } truncate text-center px-3`}
                      onClick={() => {
                        if (col === "Hash")
                          window.open(
                            "https://bscscan.com/tx/" + tx[col.toLowerCase()]
                          );
                        else if (col === "Account") {
                          window.open(
                            "https://bscscan.com/address/" +
                              tx[col.toLowerCase()]
                          );
                        }
                      }}
                    >
                      {tx[col.toLowerCase()] === "" ||
                      tx[col.toLowerCase()] === undefined ||
                      tx[col.toLowerCase()] === null ? (
                        <svg
                          class="animate-spin h-5 w-5 mr-3 items-center text-[#61ECFF]/75 ml-[3rem]"
                          viewBox="0 0 24 24"
                        >
                          <Circle />
                          <PathCircle />
                        </svg>
                      ) : col === "Action" ? (
                        <div className="flex flex-row justify-center items-center">
                          <div className="mr-[0.4rem] truncate">
                            {tx[col.toLowerCase()]}
                          </div>
                          <span
                            className={`${
                              tx[col.toLowerCase()] === "deposit"
                                ? "dot-green"
                                : "dot-red"
                            }`}
                          ></span>
                        </div>
                      ) : col === "Amount" ? (
                        <div className="flex flex-row justify-center items-center">
                          <div className="mr-[0.6rem] truncate">
                            {tx[col.toLowerCase()].toLocaleString()}
                          </div>
                        </div>
                      ) : col === "Time" ? (
                        <div className="">
                          <div className="parent-div">
                            {" "}
                            {tx[col.toLowerCase()]}
                          </div>
                          <div className="hover-text w-[80px]  px-3 py-2 text-sm font-medium text-gray-900 bg-white rounded-lg shadow-sm  tooltip">
                            {tx["hoverTime"]}
                            <div
                              class="tooltip-arrow -top-[10%] left-[10%]"
                              data-popper-arrow
                            ></div>
                          </div>
                        </div>
                      ) : (
                        tx[col.toLowerCase()]
                      )}
                    </div>
                  );
                })}
              </div>
              {index !== txlist.length - 1 && (
                <hr class="w-full h-px my-4 bg-gray-500/25 border-0 dark:bg-gray-400/25"></hr>
              )}
            </div>
          );
        })}
        <div className="flex flex-row justify-center mt-[2rem] items-center">
          <img
            src={new_arrow}
            className={`h-[30px] w-[30px] rotate-180 cursor-pointer ${
              page === 0 ? "opacity-25" : "opacity-100"
            }`}
            onClick={handleChangeDown}
          />
          <input
            className="w-[40px] h-[40px] rounded-md mx-[8px] text-center p-0"
            value={pageNumber}
            placeholder="."
            type="number"
            onChange={(event) => {
              // console.log(pages[Math.max(parseInt(event.target.value) - 1, 0)]);
              setPageNumber(event.target.value.toString());
              if (event.target.value !== "") {
                setPage(Math.max(parseInt(event.target.value) - 1, 0));
                setTxList(pages[Math.max(parseInt(event.target.value) - 1, 0)]);
              }
            }}
          />{" "}
          <span className="text-white">. . . 100</span>
          <img
            src={new_arrow}
            className={`h-[30px] w-[30px] cursor-pointer ${
              page + 1 === pages.length ? "opacity-25" : "opacity-100"
            }`}
            onClick={handleChangeUp}
          />
        </div>
      </div>

      <div className="flex bottom-0 ss:flex-row flex-col gap-y-[1rem] w-full min-h-[4rem] bg-[#00A9BE] justify-between items-center p-2 ss:px-[3rem]">
        <div className="flex flex-row  align-text-center justify-center gap-x-[10px]">
          <img src={logo} />
          <div className="text-white items-center flex">Cakepool</div>
        </div>
        <div className="flex flex-row gap-x-[10px]">
          <img
            src={telegram}
            alt=""
            className="cursor-pointer"
            onClick={() => {
              window.open("https://t.me/CakePoolStaking");
            }}
          />
          <img
            src={twitter}
            alt=""
            className="cursor-pointer"
            onClick={() => {
              window.open("https://twitter.com/CakePoolTweets");
            }}
          />
          <img
            src={reddit}
            alt=""
            className="cursor-pointer"
            onClick={() => {
              window.open("https://www.reddit.com/r/CakePool");
            }}
          />
          <img
            src={discord}
            alt=""
            className="cursor-pointer"
            onClick={() => {
              window.open("https://t.co/LM6JNrNblJ");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
