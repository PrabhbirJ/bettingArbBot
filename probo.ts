
const AUTH_TOKEN = ""
const axios = require('axios');
import type { Depth } from './types';
export function getAvailableQty(marketID:string): Promise<Depth> {
    return new Promise((resolve, reject) => {
        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://prod.api.probo.in/api/v3/tms/trade/bestAvailablePrice?eventId='+marketID+'&side=BUY&size=1',
        headers: { 
            'Content-Type': 'application/json', 
            'Accept': '*/*', 
            'Authorization': 'Bearer ugH+Z70kbTZR2TnjTNPPSFOaiANznsJdisnKhfpmr/o=', 
            'Sec-Fetch-Site': 'same-site', 
            'Accept-Language': 'en-US,en;q=0.9', 
            'Accept-Encoding': 'gzip, deflate, br', 
            'Sec-Fetch-Mode': 'cors', 
            'Origin': 'https://probo.in', 
            'Referer': 'https://probo.in/', 
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15', 
            'Sec-Fetch-Dest': 'empty', 
            'appid': 'in.probo.pro', 
            'x-device-os': 'ANDROID', 
            'x-version-name': '10', 
            'Priority': 'u=3, i'
        }
        };

        axios.request(config)
        .then((response:any) => {
            let depth: Depth = {buy: {}, sell: {}};
            Object.keys(response.data.data.available_qty).forEach((key:string) => {
                depth.buy[key] = response.data.data.available_qty.buy[key].toString();

            });
            Object.keys(response.data.data.available_qty).forEach((key:string) => {
                depth.sell[key] = response.data.data.available_qty.sell[key].toString();
            });
            resolve(depth);
        })
        .catch((error:any) => {
            reject(error);
        });
    });
}


    export function createOrder(marketId: number, side: "buy" | "sell", size: number, price: number) {
        const axios = require('axios'); 
        let data = JSON.stringify({
            "event_id": marketId,
            "offer_type": side,
            "order_type": "LO",
            "l1_order_quantity": size,
            "l1_expected_price": price,
            "advanced_options": {
                "auto_cancel": {
                "minutes": 1,
                "disable_trigger": true
                },
                "book_profit": {
                    "price": 8,
                    "quantity": 5,
                    "disable_trigger": true
                },
                "stop_loss": {
                    "price": 6.5,
                    "quantity": 5,
                    "disable_trigger": true
                }
            }
        });
    
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://prod.api.probo.in/api/v1/oms/order/initiate',
            headers: { 
                'accept': '*/*', 
                'accept-language': 'en-US,en;q=0.9', 
                'appid': 'in.probo.pro', 
                'authorization': `Bearer ${AUTH_TOKEN}`, 
                'content-type': 'application/json', 
                'origin': 'https://probo.in', 
                'priority': 'u=1, i', 
                'referer': 'https://probo.in/', 
                'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"', 
                'sec-ch-ua-mobile': '?0', 
                'sec-ch-ua-platform': '"macOS"', 
                'sec-fetch-dest': 'empty', 
                'sec-fetch-mode': 'cors', 
                'sec-fetch-site': 'same-site', 
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 
                'x-device-os': 'ANDROID', 
                'x-version-name': '10'
            },
            data : data
        };
    
        axios.request(config)
            .then((response: any) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error: any) => {
                console.log(error);
            });
    
    
    }
