import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";


const { networkConfig, useNetworkVariable } = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl("testnet"),
    },
    mainnet: {
        url: getFullnodeUrl("mainnet"),
    },
});

export { networkConfig, useNetworkVariable }