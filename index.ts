import {approveAllowance,createOrder, getDepth, getMarkets} from "./polymarket"
import { getAvailableQty } from "./probo";
import dotenv from "dotenv";
dotenv.config();
const tokenID = "113257124005600784096298443691360349241514955570631886753683004295807824352982";
const proboMarketID = "4038090";




async function main() {
    //await approveAllowance(tokenID);
    //await placeOrder(tokenID);
    //await getMarkets();
    try{
    const depth = await getDepth(tokenID);
    console.log(depth);
    const availableQty = await getAvailableQty(proboMarketID);
    console.log(availableQty);
    }
    catch(e){
        
    }
}
main();