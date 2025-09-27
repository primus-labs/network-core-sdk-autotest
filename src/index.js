/**
 * Network Core SDK Auto Test - Main Entry Point
 */

const { PrimusNetwork } = require('@primuslabs/network-core-sdk');
const { ethers } = require('ethers');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('🚀 Network Core SDK Auto Test started!');
console.log('📦 Version:', require('../package.json').version);

// Main application logic will be implemented here
async function main() {
  try {
    console.log('✅ Application initialized successfully');
    
    const chainId = 84532; // Base Sepolia
    const baseSepoliaRpcUrl = 'https://sepolia.base.org';
    
    // Create a real provider for Base Sepolia
    dotenv.config();
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      // eslint-disable-next-line no-console
      console.log('Skipping test: PRIVATE_KEY not set in .env file');
      return;
    }
    const provider = new ethers.providers.JsonRpcProvider(baseSepoliaRpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    // Test parameters
    const testAddress = '0x810b7bacEfD5ba495bB688bbFD2501C904036AB7'; // Example address
    const attestParams = {
      address: testAddress,
    };

    try {
      const primusNetwork = new PrimusNetwork();
      const initResult = await primusNetwork.init(wallet, chainId, 'wasm');
      console.log('Init result:', initResult);
      const submitResult = await primusNetwork.submitTask(attestParams);
      const requests = [
        {
          url: 'https://www.okx.com/api/v5/public/instruments?instType=SPOT&instId=BTC-USD',
          method: 'GET',
          header: {},
          body: '',
        }
      ];
      const responseResolves = [
        [
          {
            keyName: 'instType',
            parseType: 'json',
            parsePath: '$.data[0].instType'
          }
        ]
      ];

      // Compose params for attest
      const attestParams2 = {
        ...attestParams,
        ...submitResult,
        requests,
        responseResolves
      };

      const attestResult = await primusNetwork.attest(attestParams2);
      console.log('Attest result:', attestResult);

      const taskResult = await primusNetwork.verifyAndPollTaskResult({
        taskId: attestResult[0].taskId,
        reportTxHash: attestResult[0].reportTxHash
      });
      console.log('Task result:', taskResult);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Unexpected test error:', error);
      throw error;
    }
  } catch (error) {
    console.error('❌ Error starting application:', error);
    process.exit(1);
  }
}

// Start the application
if (require.main === module) {
  main();
}

module.exports = { main };
