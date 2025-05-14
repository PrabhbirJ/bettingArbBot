import {approveAllowance,createOrder, getDepth, getMarkets} from "./polymarket"
import { getAvailableQty } from "./probo";
import type { Depth } from "./types";
import dotenv from "dotenv";
dotenv.config();
const tokenID = "113257124005600784096298443691360349241514955570631886753683004295807824352982";
const proboMarketID = "4038090";

const depthProbo = await getAvailableQty(proboMarketID);
const depthPoly = await getDepth(tokenID);
console.log(depthProbo);
const DOLLAR_PRICE = 85;
const EXPECTED_ARB_PERCENT = 5;

export function findAndExecArb(depthPoly: Depth, depthProbo: Depth) {
    let p1 = Object.keys(depthPoly.sell).filter(p => Number(depthPoly.sell[p]) > 0).map(Number).sort((a, b) => b - a).pop()!; //polymarket price
    let p2 = Object.keys(depthProbo.sell).filter(p => Number(depthProbo.sell[p]) > 0).map(Number).sort((a, b) => b - a).pop()!; // probo price
    console.log(p1);// 5
    console.log(p2); // 0.74

    if (p1 * 10 + p2 >= 10) {
        console.log("No arb found");
        return;
    }

    if (10 - (p1 * 10 + p2) >= EXPECTED_ARB_PERCENT / 10) {
        console.log("Arb found");
        let q1 = Number(depthPoly.sell[p1.toString()]); // polymarket qty
        let q2 = Number(depthProbo.sell[p2.toString()]); // probo qty
        let final_polymarket_qty = 0;
        let final_probo_qty = 0;

        if (q1 * DOLLAR_PRICE/10 <= q2) {
            final_polymarket_qty = q1;
            final_probo_qty = q1 * 8.5;
        } else {
            final_probo_qty = q2;
            final_polymarket_qty = q2 / 8.5;
        }
        console.log("place an order for price " + p1 + " for qty"  + final_polymarket_qty + " on polymarket");
        console.log("place an order for price " + p2 + " for qty"  + final_probo_qty + " on probo");
    } else {
        console.log("arb found, but is not enough");
    }
}