import { 
    SHOULD_SLEEP,
  } from "../utils/config";
  
  export function sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  export async function api_wait(ms: number) {
      // Useful for reducing the calls against the network...
      if (SHOULD_SLEEP) {
          return await sleep(ms);
      }
  
      return Promise.resolve();
  }