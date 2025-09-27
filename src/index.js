/**
 * Network Core SDK Auto Test - Main Entry Point
 */

const { PrimusNetwork } = require('@primuslabs/network-core-sdk');
const { ethers } = require('ethers');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { getTestCases } = require('./testCases');

// Load environment variables
dotenv.config();

console.log('🚀 Network Core SDK Auto Test started!');
console.log('📦 Version:', require('../package.json').version);

// Data storage for test results
let resultsFilePath = '';

/**
 * Initialize results file
 */
function initializeResultsFile() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `test-results-${timestamp}.json`;
  resultsFilePath = path.join(__dirname, '..', 'results', filename);

  // Ensure results directory exists
  const resultsDir = path.dirname(resultsFilePath);
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  // Initialize file with empty results array
  const initialData = {
    timestamp: new Date().toISOString(),
    results: []
  };

  fs.writeFileSync(resultsFilePath, JSON.stringify(initialData, null, 2));
  console.log(`📄 Results file initialized: ${resultsFilePath}`);
}

/**
 * Append single test result to file
 */
function appendResultToFile(resultData) {
  // Read existing data
  const existingData = JSON.parse(fs.readFileSync(resultsFilePath, 'utf8'));

  // Add new result
  existingData.results.push(resultData);

  // Write back to file
  fs.writeFileSync(resultsFilePath, JSON.stringify(existingData, null, 2));
  console.log(`📄 Result appended to: ${resultsFilePath}`);
}


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

      const testCases = getTestCases();

      // Initialize results file
      initializeResultsFile();

      // Configuration: Set number of rounds to run
      const maxRounds = process.env.MAX_ROUNDS ? parseInt(process.env.MAX_ROUNDS) : 1;

      console.log(`📊 Configuration: Running ${maxRounds} rounds with ${testCases.length} test cases each`);

      // Outer loop: Run multiple rounds
      for (let round = 1; round <= maxRounds; round++) {
        console.log(`\n🚀 Starting Round ${round}/${maxRounds}`);

        // Inner loop: Run all test cases in each round
        for (let i = 0; i < testCases.length; i++) {
          const testCase = testCases[i];
          console.log(`\n🔄 Round ${round} - Executing test case ${i + 1}/${testCases.length}: ${testCase.name}`);

          try {
            const testStartTime = Date.now();
            console.log(`⏰ ${testCase.name} - Start time: ${new Date().toISOString()}`);

            // Submit task for each test case
            const submitStartTime = Date.now();
            const submitResult = await primusNetwork.submitTask(attestParams);
            const submitEndTime = Date.now();
            const submitDuration = submitEndTime - submitStartTime;
            console.log(`📝 ${testCase.name} - Submit result:`, submitResult);
            console.log(`⏱️  ${testCase.name} - Submit duration: ${submitDuration}ms`);

            // Compose params for attest
            const attestParams2 = {
              ...attestParams,
              ...submitResult,
              requests: testCase.requests,
              responseResolves: testCase.responseResolves
            };

            const attestStartTime = Date.now();
            const attestResult = await primusNetwork.attest(attestParams2);
            const attestEndTime = Date.now();
            const attestDuration = attestEndTime - attestStartTime;
            console.log(`✅ ${testCase.name} - Attest result:`, attestResult);
            console.log(`⏱️  ${testCase.name} - Attest duration: ${attestDuration}ms`);

            // Store test result data after attest
            const resultData = {
              round: round,
              testCaseName: testCase.name,
              attestationTime: attestResult[0].attestationTime,
              attestorUrl: attestResult[0].attestorUrl,
              timestamp: new Date().toISOString()
            };

            // Append result to file immediately
            appendResultToFile(resultData);

            const verifyStartTime = Date.now();
            const taskResult = await primusNetwork.verifyAndPollTaskResult({
              taskId: attestResult[0].taskId,
              reportTxHash: attestResult[0].reportTxHash
            });
            const verifyEndTime = Date.now();
            const verifyDuration = verifyEndTime - verifyStartTime;
            console.log(`✅ ${testCase.name} - Task result:`, taskResult);
            console.log(`⏱️  ${testCase.name} - Verify duration: ${verifyDuration}ms`);

            const testEndTime = Date.now();
            const totalDuration = testEndTime - testStartTime;
            console.log(`🎯 ${testCase.name} - Total duration: ${totalDuration}ms`);
            console.log(`📊 ${testCase.name} - Time breakdown: Submit(${submitDuration}ms) + Attest(${attestDuration}ms) + Verify(${verifyDuration}ms) = ${totalDuration}ms`);

          } catch (error) {
            console.error(`❌ Round ${round} - ${testCase.name} - Test failed:`, error.message);
            // Continue with next test case instead of interrupting the entire flow
            continue;
          }
        }

        console.log(`\n✅ Round ${round}/${maxRounds} completed!`);
      }

      console.log('\n🎉 All test cases completed!');
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
