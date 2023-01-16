import React, { useState, useRef, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Home() {
  return (
    <div className="flex flex-col justify-center h-full align-center mb-[50px]  mt-[50px]">
      <ConnectButton />
    </div>
  );
}

export default Home;
