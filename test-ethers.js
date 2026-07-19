const { BrowserProvider, getBytes } = require('ethers');

// mock window.ethereum
global.window = {};
const mockProvider = {
  request: async (args) => {
    console.log("RPC Request:", JSON.stringify(args, null, 2));
    if (args.method === 'eth_requestAccounts' || args.method === 'eth_accounts') {
      return ["0x1234567890123456789012345678901234567890"];
    }
    if (args.method === 'personal_sign') {
      return "0xsignature";
    }
  }
};
const browserProvider = new BrowserProvider(mockProvider);
async function run() {
  const signer = await browserProvider.getSigner();
  const hexHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  await signer.signMessage(getBytes(hexHash));
}
run();
