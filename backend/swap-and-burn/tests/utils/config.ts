export const PREFIX_POOL_STATE = "pool_state";
export const PREFIX_POOL_VAULT = "pool_vault";

export const SAFE_REQ_TIMEOUT = 200; //ms
export const SHOULD_SLEEP = true; // enable this for devnet
export const SHOULD_LOG = true;

export function getAnchorConfig(key:string)  {
    const fs = require('fs');
    const config = fs.readFileSync('Anchor.toml', 'utf-8');
    const regex = new RegExp(`^\\s*${key}\\s*=\\s*"([^"]+)"`, 'm');
    return config.match(regex)[1];
}

export function setEnvironment() {
    const process = require("process");
    if (!process.env.ANCHOR_WALLET) {
        process.env["ANCHOR_WALLET"] = getAnchorConfig("wallet");
    }
    if (!process.env.ANCHOR_PROVIDER_URL) {
        process.env["ANCHOR_PROVIDER_URL"] = "http://127.0.0.1:8899/"
    }
}
