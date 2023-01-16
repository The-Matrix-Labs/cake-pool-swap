import { useState } from "react";
import reactLogo from "./assets/react.svg";
import styles from "./style";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, bsc } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import Home from "./Components/Home/Home";
import Dashboard from "./Components/Dashboard/Dashboard";
import { Router, Location } from "@reach/router";

const { chains, provider } = configureChains(
  [bsc, mainnet, polygon, optimism, arbitrum],
  [alchemyProvider({ apiKey: import.meta.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id="routerhang">
        <div key={location.key}>
          <Router location={location} class="new_1">
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

function App() {
  const [count, setCount] = useState(0);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <PosedRouter>
          <Dashboard exact path="/" />
        </PosedRouter>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
