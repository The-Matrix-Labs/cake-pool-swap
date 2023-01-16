import styles from "./style";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { Home } from "./components";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, bsc } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

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

const App = () => (
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </RainbowKitProvider>
  </WagmiConfig>
);

export default App;
