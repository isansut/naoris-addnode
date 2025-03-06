require('dotenv').config();
const axios = require('axios');

const API_URL = 'https://naorisprotocol.network/sec-api/api/switch';
const BEARER_TOKEN = process.env.BEARER_TOKEN;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;

if (!BEARER_TOKEN || !WALLET_ADDRESS) {
    console.error("BEARER_TOKEN atau WALLET_ADDRESS tidak ditemukan di .env!");
    process.exit(1);
}

function getRandomDeviceHash() {
    return Math.floor(Math.random() * 10000000);
}

async function switchState(state = 'ON') {
    try {
        const response = await axios.post(API_URL, {
            walletAddress: WALLET_ADDRESS,
            state: state,
            deviceHash: getRandomDeviceHash()
        }, {
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
            }
        });
        console.log(`[${new Date().toISOString()}] Response:`, response.data);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error:`, error.response ? error.response.data : error.message);
    }
}

async function startLoop(interval = 1000) { 
    while (true) {
        await switchState();
        await new Promise(resolve => setTimeout(resolve, interval));
    }
}

startLoop();
