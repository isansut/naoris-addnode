require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const API_URL = 'https://naorisprotocol.network/sec-api/api/switch';
const BEARER_TOKEN = process.env.BEARER_TOKEN;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;

if (!BEARER_TOKEN || !WALLET_ADDRESS) {
    console.error("BEARER_TOKEN atau WALLET_ADDRESS tidak ditemukan di .env!");
    process.exit(1);
}

function getDeviceHashes() {
    try {
        const data = fs.readFileSync('devices.txt', 'utf8');
        return data.split('\n').map(line => line.trim()).filter(line => line);
    } catch (error) {
        console.error("Gagal membaca devices.txt", error.message);
        process.exit(1);
    }
}

const deviceHashes = getDeviceHashes();

async function switchState(deviceHash, state = 'ON') {
    try {
        const response = await axios.post(API_URL, {
            walletAddress: WALLET_ADDRESS,
            state: state,
            deviceHash: deviceHash
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
        for (const deviceHash of deviceHashes) {
            await switchState(deviceHash);
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }
}

startLoop();
