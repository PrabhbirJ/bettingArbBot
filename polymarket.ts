import { MaxUint256 } from "@ethersproject/constants";
import { getUsdcContract } from "./clob-client/examples/approveAllowances";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { Chain, ClobClient, getContractConfig, Side } from "./clob-client/src/index";
import type { Depth } from "./types";
const POLYMARKET_API_KEY = process.env.key;
const POLYMARKET_API_SECRET = process.env.secret;
const POLYMARKET_PASS_PHRASE = process.env.passphrase;
const ETH_PRIVATE_KEY = process.env.PK;

if (!ETH_PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is not set");
}

const host = process.env.CLOB_API_URL || "https://clob.polymarket.com";
const rpcUrl = process.env.RPC_URL || "https://polygon-rpc.com";
const provider = new JsonRpcProvider(rpcUrl);
const signer = new Wallet(ETH_PRIVATE_KEY,provider);

const clobClient = new ClobClient(host, Chain.POLYGON, signer, {
    key: POLYMARKET_API_KEY!,
    secret: POLYMARKET_API_SECRET!,
    passphrase: POLYMARKET_PASS_PHRASE!,
});

export async function approveAllowance(tokenId: string) {
    console.log("approve al;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owanceal;l;owance")
    const usdc = getUsdcContract(true, signer);
    const contractConfig = getContractConfig(Chain.POLYGON);
    
    const txn = await usdc.approve(contractConfig.conditionalTokens, MaxUint256, {
        gasPrice: 100_000_000_000,
        gasLimit: 200_000,
    });
    console.log(txn);
    console.log(`Setting USDC allowance for CTF: ${txn.hash}`);
    await txn.wait();
    
}

export async function createOrder(tokenId: string, price: number, size: number) {
    // Then create and post order
    const order = await clobClient.createOrder({
        tokenID: tokenId,
        price,
        side: Side.BUY,
        size,
        feeRateBps: 0,
    });
    const res = await clobClient.postOrder(order);
    console.log(res);
    return res;
}

export async function getDepth(tokenId: string): Promise<Depth> {
    const response = await clobClient.getOrderBook(
        tokenId
    );
    let depth: Depth = {buy: {}, sell: {}};
    response.bids.map(bid => {
        depth.buy[bid.price.toString()] = bid.size.toString();
    })
    response.asks.map(ask => {
        depth.sell[ask.price.toString()] = ask.size.toString();
    })
    return depth;
}

export async function getMarkets() {
    const markets = await clobClient.getSamplingMarkets("");

    const activeMarkets = markets.data.filter((market) => market.active === true && market.closed === false).slice(0, 3);

    if (activeMarkets.length === 0) {
        console.log("No active markets found.");
        return;
    }

    console.log("Top 3 Active Markets:");
    activeMarkets.forEach((market, idx) => {
        console.log(`\n🔹 Market ${idx + 1}:`);
        console.log(JSON.stringify(market, null, 2));
        console.log(market.tokens[0])
    });

    return activeMarkets;
}
  