import { createApp } from 'vue'
import App from './App.vue'
import KinERC20Swap from '../src/index'
import WalletButton from "solana-wallets-vue";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "solana-wallets-vue/styles.css";
import './style.css'

const network = WalletAdapterNetwork.Mainnet;
const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new TorusWalletAdapter(),
    new SolletWalletAdapter({ network }),
    new SolletExtensionWalletAdapter({ network }),
  ],
  autoConnect: false,
};

const opt = {
  rpcUrl: "https://kin-rpc.erc20bridge.org",
}

const app = createApp(App);
app.use(WalletButton, walletOptions);
app.use(KinERC20Swap, opt);
app.mount("#app");