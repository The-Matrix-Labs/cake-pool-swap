import React, { useState, useRef, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { discord, logo, reddit, telegram, twitter, lock } from "../assets";

function Home() {
  return (
    <div className="flex flex-col justify-center ">
      <div className="flex w-full h-[4rem] bg-[#00A9BE] justify-between items-center p-2 ss:px-[3rem]">
        <div className="flex flex-row  align-text-center justify-center gap-x-[10px]">
          <img src={logo} />
          <div className="text-white items-center flex">Cakepool</div>
        </div>
        <ConnectButton />
      </div>
      <div className="flex bg-[#035D68] rounded-xl p-6 px-[2rem] ss:mx-[9rem] ss:my-[5rem] my-[1rem] mx-[10px] justify-around flex-col ">
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
            <div className="flex  flex-col ss:bg-transparent bg-[#027785] ss:w-auto w-[48%] rounded-md ss:text-start text-center ss:py-0 py-[0.7rem]">
              <div className="text-white mb-[1rem] ss:text-[0.9rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem] text-gray-100/50">
                Recent profit
              </div>
              <div className="flex flex-col  align-text-center justify-center gap-y-[1px]">
                <div className="text-white text-[1rem] leading-[1.2rem] font-thick">
                  0.00029
                </div>
                <div className="text-white items-center ss:justify-start justify-center font-thin flex text-[0.8rem] leading-[0.9rem] w-full">
                  Stake CAKE
                </div>
              </div>
            </div>
            <div className="flex  flex-col ss:bg-transparent bg-[#027785] ss:w-auto w-[48%] rounded-md ss:text-start text-center ss:py-0 py-[0.7rem]">
              <div className="text-white mb-[1rem] ss:text-[0.9rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem] text-gray-100/50">
                Locked
              </div>
              <div className="flex flex-col  align-text-center justify-center gap-y-[1px]">
                <div className="text-white text-[1rem] leading-[1.2rem] font-thick">
                  570.00029
                </div>
                <div className="text-white items-center ss:justify-start justify-center font-thin flex text-[0.8rem] leading-[0.9rem]">
                  1,878.01 USD
                </div>
              </div>
            </div>

            <div className="flex  flex-col ss:bg-transparent bg-[#027785] ss:w-auto w-[48%] rounded-md ss:text-start text-center ss:py-0 py-[0.7rem]">
              <div className="text-white mb-[1rem] ss:text-[0.9rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem] text-gray-100/50">
                APR
              </div>
              <div className="flex flex-col  align-text-center justify-center gap-y-[1px] items-top">
                <div className="text-white text-[1rem] leading-[1.2rem] font-thick ">
                  48.32%
                </div>
              </div>
            </div>
            <div className="flex  flex-col ss:bg-transparent bg-[#027785] ss:w-auto w-[48%] rounded-md ss:text-start text-center ss:py-0 py-[0.7rem]">
              <div className="text-white mb-[1rem] ss:text-[0.9rem] ss:leading-[1rem] text-[0.7rem] leading-[0.9rem] text-gray-100/50">
                Total Staked
              </div>
              <div className="flex flex-col  align-text-center justify-center gap-y-[1px] items-top">
                <div className="text-white text-[1rem] leading-[1.2rem] font-thick ">
                  252,226,093 CAKE
                </div>
              </div>
            </div>
          </div>

          <div className="text-[#61ECFF] ss:text-[1.5rem] text-[1.2rem] ss:leading-[1.6rem] leading-[1.4rem] ss:w-[20%] w-full ss:text-center text-end">
            Hide
          </div>
        </div>
        <hr class="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-400"></hr>
        <div className="flex justify-around ss:flex-row flex-col gap-y-[1rem]">
          <div className="flex ss:flex-col flex-row ss:justify-start justify-between align-center">
            <div className="text-white items-center  font-thin flex text-[0.8rem] leading-[0.9rem] ss:mb-[1rem] ss:w-full w-[50%]">
              Cake Locked
            </div>
            <div className="ss:w-full w-[50%]">
              <div className="text-white font-bold ss:text-[2rem] text-[1.5rem] ss:leading-[1.7rem] leading-[1.3rem] mb-[5px]">
                570.00029
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
                357 Days
              </div>
              <div className="text-white items-center font-thin flex text-[0.8rem] leading-[0.9rem]">
                On Dec 30, 2023, 09:18
              </div>
            </div>
          </div>
          <div className="flex ss:flex-col flex-row ss:justify-start justify-between">
            <div className="text-white items-center font-thin flex text-[0.8rem] leading-[0.9rem] ss:mb-[1rem] ss:w-full w-[50%]">
              Yield boost
            </div>
            <div className="ss:w-full w-[50%]">
              <div className="text-white font-bold ss:text-[2rem] text-[1.5rem] ss:leading-[1.7rem] leading-[1.3rem] mb-[5px]">
                20.56x
              </div>
              <div className="text-white items-center font-thin flex text-[0.8rem] leading-[0.9rem]">
                Lock for 51 weeks
              </div>
            </div>
          </div>
        </div>

        <div className="flex ss:flex-row flex-col mt-[4rem] items-center">
          <div className="flex flex-col ss:w-[40%] w-[90%] ">
            <div className="flex flex-row ss:mb-[1rem] mb-[2.1rem] ss:justify-start justify-center">
              <div className="text-white text-[1rem] leading-[1.3rem] mr-[1.6rem]">
                My Position
              </div>
              <div className="flex flex-row">
                <img src={lock} alt="" className="h-[20px] w-[20px]" />
                <div className="text-white text-[1rem] leading-[1.3rem]">
                  Locked
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="text-gray-200/50 text-[1rem] leading-[1.3rem] mr-[5px]">
                Total locked:
              </div>
              <div className="text-gray-200/50 text-[1rem] leading-[1.3rem] ">
                195,673,040 CAKE
              </div>
            </div>
            <div className="flex flex-row">
              <div className="text-gray-200/50 text-[0.7rem] leading-[0.9rem] mr-[5px]">
                Average lock duration:
              </div>
              <div className="text-gray-200/50 text-[0.7rem] leading-[0.9rem] ">
                42 weeks
              </div>
            </div>
          </div>
          <div className="flex ss:flex-row flex-wrap-row ss:w-[60%] w-[90%] justify-around flex-wrap text-center ss:m-0 mt-[1.5rem] gap-y-[1.7rem]">
            <div className="text-[#61ECFF] underline decoration-[#61ECFF] ss:w-auto w-[50%]">
              See token info
            </div>
            <div className="text-[#61ECFF] underline decoration-[#61ECFF] ss:w-auto w-[50%]">
              View tutorial
            </div>
            <div className="text-[#61ECFF] underline decoration-[#61ECFF] ss:w-auto w-[50%]">
              View contract
            </div>
            <div className="text-[#61ECFF] underline decoration-[#61ECFF] ss:w-auto w-[50%]">
              Add to Wallet
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-[#035D68] rounded-xl p-6 px-[2rem] ss:mx-[9rem] ss:my-[5rem] my-[1rem] mx-[10px] justify-around flex-col "></div>

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
