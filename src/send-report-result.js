/**
 * Send Report Result Transaction
 * Send a reportResult transaction using the encoded data
 */

const { ethers } = require('ethers');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function sendReportResultTransaction() {
  try {
    console.log('🚀 Sending Report Result Transaction...\n');

    // Configuration
    const chainId = 84532; // Base Sepolia
    const baseSepoliaRpcUrl = 'https://sepolia.base.org';

    // Get private key from environment
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      console.error('❌ PRIVATE_KEY not set in .env file');
      return;
    }

    // Create provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(baseSepoliaRpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log(`📋 Wallet Address: ${wallet.address}`);
    console.log(`📋 Network: Base Sepolia (${chainId})`);

    // Get current gas price
    const gasPrice = await provider.getGasPrice();
    console.log(`📋 Gas Price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);

    // The encoded reportResult data
    const reportResultData = '0x9f59af7fde212d532a9c9d2e9870c8d827edcce688423b0b84f5bdb74769152e4605911b00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000560000000000000000000000000810b7bacefd5ba495bb688bbfd2501c904036ab700000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000044000000000000000000000000000000000000000000000000000000000000004a0000000000000000000000000000000000000000000000000000001999458f4aa00000000000000000000000000000000000000000000000000000000000004c0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000004a68747470733a2f2f7777772e6f6b782e636f6d2f6170692f76352f7075626c69632f696e737472756d656e74733f696e7374547970653d53504f5426696e737449643d4254432d55534400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034745540000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000008696e73745479706500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012242e646174615b305d2e696e737454797065000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000287b22696e737454797065223a2253504f54222c22696e7374547970652e636f756e74223a2231227d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c7b22616c676f726974686d54797065223a2270726f7879746c73227d000000000000000000000000000000000000000000000000000000000000000000000041ebdb99491af66cc476e1dff8f02677498acfeddee4ee01abd7b6c56c35ea8f2f67af66e47fd9389a28de5f5d75ed6b342f12a56c667dff3730137d1cca3219781b00000000000000000000000000000000000000000000000000000000000000';

    // You need to specify the contract address where this transaction should be sent
    // This should be the address of the contract that has the reportResult function
    const contractAddress = '0xC02234058caEaA9416506eABf6Ef3122fCA939E8'; // Replace with actual contract address

    console.log(`📋 Contract Address: ${contractAddress}`);
    console.log(`📋 Data Length: ${reportResultData.length} characters`);

    // Get current nonce
    const nonce = await wallet.getTransactionCount();
    console.log(`📋 Nonce: ${nonce}`);

    // Estimate gas limit
    let gasLimit;
    try {
      gasLimit = await provider.estimateGas({
        to: contractAddress,
        data: reportResultData,
        from: wallet.address
      });
      console.log(`📋 Estimated Gas Limit: ${gasLimit.toString()}`);
    } catch (error) {
      console.log(`⚠️  Could not estimate gas: ${error.message}`);
      gasLimit = ethers.BigNumber.from('500000'); // Use a default gas limit
      console.log(`📋 Using default Gas Limit: ${gasLimit.toString()}`);
    }

    // Create transaction
    const transaction = {
      to: contractAddress,
      data: reportResultData,
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      nonce: nonce,
      value: 0 // No ETH value
    };

    console.log('\n📝 Transaction Details:');
    console.log(`   To: ${transaction.to}`);
    console.log(`   Gas Limit: ${transaction.gasLimit.toString()}`);
    console.log(`   Gas Price: ${ethers.utils.formatUnits(transaction.gasPrice, 'gwei')} gwei`);
    console.log(`   Nonce: ${transaction.nonce}`);
    console.log(`   Value: ${transaction.value} ETH`);

    // Calculate estimated transaction cost
    const estimatedCost = gasLimit.mul(gasPrice);
    console.log(`   Estimated Cost: ${ethers.utils.formatEther(estimatedCost)} ETH`);

    // Check wallet balance
    const balance = await wallet.getBalance();
    console.log(`\n💰 Wallet Balance: ${ethers.utils.formatEther(balance)} ETH`);

    if (balance.lt(estimatedCost)) {
      console.error(`❌ Insufficient balance. Need ${ethers.utils.formatEther(estimatedCost)} ETH, have ${ethers.utils.formatEther(balance)} ETH`);
      return;
    }

    // Send transaction
    console.log('\n🚀 Sending transaction...');
    const txResponse = await wallet.sendTransaction(transaction);

    console.log('✅ Transaction sent!');
    console.log(`📋 Transaction Hash: ${txResponse.hash}`);
    console.log(`📋 Transaction URL: https://sepolia.basescan.org/tx/${txResponse.hash}`);

    // Wait for transaction to be mined
    console.log('\n⏳ Waiting for transaction to be mined...');
    const receipt = await txResponse.wait();

    console.log('✅ Transaction mined!');
    console.log(`📋 Block Number: ${receipt.blockNumber}`);
    console.log(`📋 Gas Used: ${receipt.gasUsed.toString()}`);
    console.log(`📋 Status: ${receipt.status === 1 ? 'Success' : 'Failed'}`);

    if (receipt.status === 1) {
      console.log('\n🎉 Report Result transaction completed successfully!');
    } else {
      console.log('\n❌ Transaction failed');
    }

  } catch (error) {
    console.error(`❌ Error sending transaction: ${error.message}`);
    if (error.transaction) {
      console.error(`📋 Failed Transaction Hash: ${error.transaction.hash}`);
    }
  }
}

// Run the function
if (require.main === module) {
  sendReportResultTransaction();
}

module.exports = { sendReportResultTransaction };
