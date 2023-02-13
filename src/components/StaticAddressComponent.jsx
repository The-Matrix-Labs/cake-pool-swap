import React, { useState, useRef, useEffect } from "react";
import StaticAddressComponentData from "./StaticAddressComponentData";



function StaticAddressComponent(props) {
  return (
    <div className="flex bg-[#035D68] rounded-xl md:mx-[9rem] ss:mx-[2rem]  my-[1rem] mx-[10px] justify-around flex-col py-2">
      <div className="flex bg-[#035D68] gap-8 rounded-xl p-6 px-[2rem] justify-around flex-col ">
        <div className="flex w-full justify-between flex-col gap-y-[1rem]">
          <div className="text-white font-bold text-center ss:text-left ss:text-[1.5rem] text-[1.5rem] ss:leading-[1.7rem] leading-[1.3rem]">Wallet 1</div>
          <div className="flex w-full ss:justify-start justify-between text-white mb-[0.5rem] gap-2">
           <div>Wallet Address:</div>&nbsp;<div className="truncate text-[#61ECFF] md:max-w-1/2 max-w-[40%]">0x17927d2f8f3e60f0a396910e55477af2f499b9c4</div>
          </div>
        </div>
        <StaticAddressComponentData address="0x17927d2f8f3e60f0a396910e55477af2f499b9c4" />
        <hr class="w-full h-px bg-gray-200 border-0 dark:bg-gray-400"></hr>
      </div>
      <div className="flex bg-[#035D68] gap-8 rounded-xl p-6 px-[2rem] justify-around flex-col ">
        <div className="flex w-full justify-between flex-col gap-y-[1rem]">
          <div className="text-white font-bold text-center ss:text-left ss:text-[1.5rem] text-[1.5rem] ss:leading-[1.7rem] leading-[1.3rem]">Wallet 2</div>
          <div className="flex w-full ss:justify-start justify-between text-white mb-[0.5rem] gap-2">
           <div>Wallet Address:</div>&nbsp;<div className="truncate text-[#61ECFF] md:max-w-1/2 ss:max-w-full">0x8324323e13c2f5fcc15cb0155fb8c8d8a676dd20</div>
          </div>
        </div>
        <StaticAddressComponentData address="0x8324323e13c2f5fcc15cb0155fb8c8d8a676dd20" />
        <hr class="w-full h-px bg-gray-200 border-0 dark:bg-gray-400"></hr>
      </div>
      <div className="flex bg-[#035D68] gap-8 rounded-xl p-6 px-[2rem] justify-around flex-col ">
        <div className="flex w-full justify-between flex-col gap-y-[1rem]">
          <div className="text-white font-bold text-center ss:text-left ss:text-[1.5rem] text-[1.5rem] ss:leading-[1.7rem] leading-[1.3rem]">Wallet 3</div>
          <div className="flex w-full ss:justify-start justify-between text-white mb-[0.5rem] gap-2">
           <div>Wallet Address:</div>&nbsp;<div className="truncate text-[#61ECFF] md:max-w-1/2 ss:max-w-full">0x7fe4d188f63ab5612c22e75955cdcce068399f1a</div>
          </div>
        </div>
        <StaticAddressComponentData address="0x7fe4d188f63ab5612c22e75955cdcce068399f1a" />
        <hr class="w-full h-px bg-gray-200 border-0 dark:bg-gray-400"></hr>
      </div>
      <div className="flex bg-[#035D68] gap-8 rounded-xl p-6 px-[2rem] justify-around flex-col ">
        <div className="flex w-full justify-between flex-col gap-y-[1rem]">
          <div className="text-white font-bold text-center ss:text-left ss:text-[1.5rem] text-[1.5rem] ss:leading-[1.7rem] leading-[1.3rem]">Wallet 4</div>
          <div className="flex w-full ss:justify-start justify-between text-white mb-[0.5rem] gap-2">
           <div>Wallet Address:</div>&nbsp;<div className="truncate text-[#61ECFF] md:max-w-1/2 ss:max-w-full">0xB0Ed302D18efdE0Df7FCEd0681E89Bf7f7EaDcB6</div>
          </div>
        </div>
        <StaticAddressComponentData address="0xB0Ed302D18efdE0Df7FCEd0681E89Bf7f7EaDcB6" />
      </div>
     </div>
  );
}

export default StaticAddressComponent;
