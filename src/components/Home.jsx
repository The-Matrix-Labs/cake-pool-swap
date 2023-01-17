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
} from "../assets";
import { useSigner, useProvider } from "wagmi";
import { ethers } from "ethers";
import Values from "../contract/values.json";
import { tokenAbi, stakingAbi } from "../contract";
import { fetchTx } from "./fetchTx";

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
  const [show, setShow] = useState(true);
  const [colList, setColList] = useState(["Hash", "Account", "Action", "Time"]);
  const [txlist, setTxList] = useState([]);
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getPoolInfo();
    getUserInfo();
  }, [signer]);

  useEffect(() => {
    const fn = async () => {
      var temp = await fetchTx();
      setPages(temp);
      setTxList(temp[page]);
      console.log(temp);
      temp.forEach((tx) => {
        txlist.push(tx);
      });
    };
    fn();
  }, []);

  const handleChangeUp = () => {
    if (pages.length > page + 1) {
      setPage(page + 1);
      setTxList(pages[page]);
    }
  };

  const handleChangeDown = () => {
    if (page > 0) {
      setPage(page - 1);
      setTxList(pages[page]);
    }
  };

  useEffect(() => {}, [txlist, page]);

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

    console.log(maxDuration, minDuration);

    setAvgLockDuration((maxDuration - minDuration) / 2 / 86400 / 7);
    setTotalStaked(Math.floor(available));
    setTotalLocked(Math.floor(locked));
  };

  const getUserInfo = async () => {
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
    console.log(token_temp);
    var userinfo = await stake_temp.userInfo(signer.getAddress());
    var startTime = parseInt(userinfo.lockStartTime);
    var endTime = parseInt(userinfo.lockEndTime);
    var duration = (endTime - startTime) / 86400;
    var boostedAmount = parseFloat(
      ethers.utils.formatEther(userinfo.userBoostedShare)
    );
    var amount = parseFloat(ethers.utils.formatEther(userinfo.lockedAmount));
    setLockDuration(duration);

    endTime = new Date(endTime * 1000);
    console.log(amount + 1);
    setUnlockTime(endTime.toDateString() + " " + endTime.toLocaleTimeString());
    setIsLocked(userinfo.locked);
    setAmountLocked(amount);
    var temp_yield =
      Math.floor(((amount + boostedAmount) * 100) / amount) / 100;
    console.log(temp_yield);
    setBoostYield(temp_yield);
    setAmountProfited(boostedAmount);
  };

  const handleToggle = () => {
    setShow(!show);
  };

  useEffect(() => {}, [show, txlist]);

  return (
    <div className="flex flex-col justify-center ">
      <div className="flex w-full h-[4rem] bg-[#00A9BE] justify-between items-center p-2 ss:px-[3rem]">
        <div className="flex flex-row  align-text-center justify-center gap-x-[10px]">
          <img src={logo} />
          <div className="text-white items-center flex">Cakepool</div>
        </div>
        <ConnectButton />
      </div>
      <div className="flex bg-[#035D68] rounded-xl p-6 px-[2rem] md:mx-[9rem] md:my-[5rem] ss:mx-[2rem]  my-[1rem] mx-[10px] justify-around flex-col ">
        <div className="flex w-full justify-between ss:flex-row flex-col gap-y-[0.3rem]">
          <div className="flex ss:w-[20%] w-full flex-col ss:justify-start justify-center ">
            <div className="text-white mb-[1rem] ss:text-[0.9rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem] text-gray-100/50">
              Token
            </div>
            <div className="flex flex-row  align-text-center gap-x-[10px] ss:justify-start justify-center">
              <img src={logo} />
              <div className="text-white items-center font-bold flex ">
                Stake CAKE
              </div>
            </div>
          </div>
          <div className="flex ss:flex-row justify-between ss:w-[60%] w-full flex-wrap gap-y-[10px] ">
            <div className="flex  flex-col ss:bg-transparent  ss:w-auto w-[48%]  ss:text-start ">
              <div className="text-white ss:mb-[1rem] mb-[0.5rem] ss:text-[0.9rem] px-[0.7rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem] text-gray-100/50">
                Recent profit
              </div>
              <div className="flex flex-col ss:bg-transparent bg-[#027785] ss:py-0 p-[0.7rem] rounded-md align-text-center justify-center gap-y-[1px]">
                <div className="text-white text-[1rem] leading-[1.2rem] font-thick">
                  {Math.floor(amountProfited * 100000) / 100000}
                </div>
                <div className="ss:text-white text-gray-200/50 items-center ss:justify-start font-thin flex text-[0.8rem] leading-[0.9rem] w-full">
                  Stake CAKE
                </div>
              </div>
            </div>
            <div className="flex  flex-col  ss:bg-transparent  ss:w-auto w-[48%]  ss:text-start ">
              <div className="text-white ss:mb-[1rem] mb-[0.5rem] ss:text-[0.9rem] px-[0.7rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem] text-gray-100/50">
                Locked
              </div>
              <div className="flex flex-col ss:bg-transparent bg-[#027785] ss:py-0 p-[0.7rem] rounded-md align-text-center justify-center gap-y-[1px]">
                <div className="text-white text-[1rem] leading-[1.2rem] font-thick">
                  {amountLocked}
                </div>
                <div className="ss:text-white text-gray-200/50 items-center ss:justify-start font-thin flex text-[0.8rem] leading-[0.9rem] w-full">
                  1,878.01 USD
                </div>
              </div>
            </div>

            <div className="flex  flex-col  ss:w-auto w-[48%]  ss:text-start ">
              <div className="text-white ss:mb-[1rem] mb-[0.5rem] ss:text-[0.9rem] px-[0.7rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem] text-gray-100/50">
                APR
              </div>
              <div className="flex flex-col ss:bg-transparent bg-[#027785] ss:py-0 p-[0.7rem] rounded-md align-text-center justify-center gap-y-[1px] h-full">
                <div className="text-white text-[1rem] leading-[1.2rem] font-thick ">
                  48.32%
                </div>
              </div>
            </div>
            <div className="flex  flex-col ss:bg-transparent  ss:w-auto w-[48%]  ss:text-start ">
              <div className="text-white ss:mb-[1rem] mb-[0.5rem] ss:text-[0.9rem] px-[0.7rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem] text-gray-100/50">
                Total Staked
              </div>
              <div className="flex flex-col ss:bg-transparent bg-[#027785] ss:py-0 p-[0.7rem] rounded-md align-text-center justify-center gap-y-[1px]">
                <div className="text-white text-[1rem] leading-[1.2rem] font-thick">
                  {totalStaked}
                </div>
                <div className="ss:text-white text-gray-200/50 items-center ss:justify-start font-thin flex text-[0.8rem] leading-[0.9rem] w-full">
                  CAKE
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              handleToggle();
            }}
            className="transition ease-in-out duration-550 text-[#61ECFF] ss:text-[1.5rem] text-[1.2rem] ss:leading-[1.6rem] leading-[1.4rem] ss:w-[20%] w-full ss:text-center text-end"
          >
            Hide
          </div>
        </div>
        {true && (
          <div
            className={`transition-all delay-150 duration-300 overflow-hidden transition ease-in-out duration-500 ${
              show ? "h-fill" : "h-0"
            }`}
          >
            <hr class="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-400"></hr>
            <div className="flex justify-around ss:flex-row flex-col gap-y-[1rem]">
              <div className="flex ss:flex-col flex-row ss:justify-start justify-between align-center">
                <div className="text-white items-center  font-thin flex text-[0.8rem] leading-[0.9rem] ss:mb-[1rem] ss:w-full w-[50%]">
                  Cake Locked
                </div>
                <div className="ss:w-full w-[50%]">
                  <div className="text-white font-bold ss:text-[2rem] text-[1.5rem] ss:leading-[1.7rem] leading-[1.3rem] mb-[5px]">
                    {amountLocked}
                  </div>
                  <div className="text-white items-center font-thin flex text-[0.8rem] leading-[0.9rem]">
                    1,878.01 USD
                  </div>
                </div>
              </div>

              <div className="flex ss:flex-col flex-row ss:justify-start justify-between">
                <div className="text-white items-center font-thin flex text-[0.8rem] leading-[0.9rem] ss:mb-[1rem] ss:w-full w-[50%]">
                  Unlocks In
                </div>
                <div className="ss:w-full w-[50%]">
                  <div className="text-white font-bold ss:text-[2rem] text-[1.5rem] ss:leading-[1.7rem] leading-[1.3rem] mb-[5px]">
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
                  <div className="text-white font-bold ss:text-[2rem] text-[1.5rem] ss:leading-[1.7rem] leading-[1.3rem] mb-[5px]">
                    {boostYield}x
                  </div>
                  <div className="text-white items-center font-thin flex text-[0.8rem] leading-[0.9rem]">
                    Lock for {lockDuration / 7} weeks
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
                    <img src={lock} alt="" className="h-[20px] w-[20px]" />
                    <div className="text-white text-[1rem] leading-[1.3rem]">
                      {isLocked ? "Locked" : "Unlocked"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="text-gray-200/50 text-[1rem] leading-[1.3rem] mr-[5px]">
                    Total locked:
                  </div>
                  <div className="text-gray-200/50 text-[1rem] leading-[1.3rem] ">
                    {totalLocked} CAKE
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="text-gray-200/50 text-[0.7rem] leading-[0.9rem] mr-[5px]">
                    Average lock duration:
                  </div>
                  <div className="text-gray-200/50 text-[0.7rem] leading-[0.9rem] ">
                    {Math.floor(avgLockDuration)} weeks
                  </div>
                </div>
              </div>
              <div className="flex ss:flex-row flex-wrap-row ss:w-[60%] w-[100%] justify-around flex-wrap text-center ss:m-0 mt-[1.5rem] gap-y-[1.7rem]">
                <div className="text-[#61ECFF] underline decoration-[#61ECFF] ss:w-auto w-[48%] flex flex-row">
                  See token info
                  <img src={arrow} className="w-[20px] h-[20px]" alt="" />
                </div>
                <div className="text-[#61ECFF] underline decoration-[#61ECFF] ss:w-auto w-[48%] flex flex-row">
                  View tutorial
                  <img src={arrow} className="w-[20px] h-[20px]" alt="" />
                </div>
                <div className="text-[#61ECFF] underline decoration-[#61ECFF] ss:w-auto w-[48%] flex flex-row gap-x-[5px]">
                  View contract
                  <img src={bscScan} className="w-[20px] h-[20px]" alt="" />
                </div>
                <div className="text-[#61ECFF] underline decoration-[#61ECFF] ss:w-auto w-[48%] flex flex-row whitespace-nowrap gap-x-[5px]">
                  Add to Wallet
                  <img src={metamask} className="w-[20px] h-[20px]" alt="" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex bg-[#035D68] rounded-xl p-6 px-[2rem] md:mx-[9rem] md:mb-[5rem] ss:mx-[2rem]  mb-[1rem] mx-[10px] justify-around flex-col ">
        <div className="flex flex-row justify-between w-full mb-[2rem]">
          {colList.map((col) => {
            let l = colList.length + 1;
            let widths = "w-1/" + l;
            return (
              <div
                className={`text-white ${widths} font-bold ss:text-[0.8rem] text-center ss:leading-[1rem] text-[1rem] leading-[1.2rem]`}
              >
                {col}
              </div>
            );
          })}
        </div>
        {txlist.map((tx, index) => {
          let l = colList.length + 1;
          let widths = "w-1/" + l;
          return (
            <div>
              <div className="flex flex-row justify-between">
                {colList.map((col) => {
                  return (
                    <div
                      className={`${widths} ${
                        col === "Hash" || col === "Account"
                          ? "text-[#61ECFF]/75"
                          : "text-gray-100/75"
                      } truncate text-center`}
                    >
                      {tx[col.toLowerCase()]}
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
        <div className="flex flex-row justify-end mt-[1rem]">
          <div className="p-[20px] bg-white" onClick={handleChangeUp}></div>
          <div className="p-[20px] bg-black" onClick={handleChangeDown}></div>
        </div>
      </div>

      <div className="flex ss:flex-row flex-col gap-y-[1rem] w-full min-h-[4rem] bg-[#00A9BE] justify-between items-center p-2 ss:px-[3rem]">
        <div className="flex flex-row  align-text-center justify-center gap-x-[10px]">
          <img src={logo} />
          <div className="text-white items-center flex">Cakepool</div>
        </div>
        <div className="flex flex-row gap-x-[10px]">
          <img src={telegram} alt="" />
          <img src={twitter} alt="" />
          <img src={reddit} alt="" />
          <img src={discord} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Home;
