/**
 * ABI Decoder Tool
 * Ethereum contract ABI and encoded data parser
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

class ABIDecoder {
  constructor() {
    this.iface = null;
    this.abi = null;
  }

  /**
   * Load ABI file
   * @param {string} abiPath - ABI file path
   */
  loadABI(abiPath) {
    try {
      const abiContent = fs.readFileSync(abiPath, 'utf8');
      this.abi = JSON.parse(abiContent);
      this.iface = new ethers.utils.Interface(this.abi);
      console.log(`✅ ABI loaded from: ${abiPath}`);
      console.log(`📋 Found ${this.abi.length} functions/events`);
      return true;
    } catch (error) {
      console.error(`❌ Error loading ABI: ${error.message}`);
      return false;
    }
  }

  /**
   * Create parser from ABI object
   * @param {Array} abi - ABI array
   */
  setABI(abi) {
    try {
      this.abi = abi;
      this.iface = new ethers.utils.Interface(abi);
      console.log('✅ ABI set successfully');
      console.log(`📋 Found ${abi.length} functions/events`);
      return true;
    } catch (error) {
      console.error(`❌ Error setting ABI: ${error.message}`);
      return false;
    }
  }

  /**
   * Decode encoded data
   * @param {string} encodedData - Encoded data (hex string starting with 0x)
   * @returns {Object} Decode result
   */
  decodeData(encodedData) {
    if (!this.iface) {
      throw new Error('ABI not loaded. Please load ABI first.');
    }

    try {
      // Remove 0x prefix if exists
      const cleanData = encodedData.startsWith('0x') ? encodedData.slice(2) : encodedData;

      // Check if data length is sufficient
      if (cleanData.length < 8) {
        return {
          type: 'error',
          error: 'Data too short to contain function selector',
          rawData: encodedData
        };
      }

      // Get function selector (first 4 bytes)
      const selector = '0x' + cleanData.slice(0, 8);

      // Get data part
      const data = '0x' + cleanData.slice(8);

      console.log('🔍 Analyzing encoded data:');
      console.log(`   Selector: ${selector}`);
      console.log(`   Data: ${data}`);

      // Try to parse function call
      try {
        const decoded = this.iface.parseTransaction({ data: encodedData });

        return {
          type: 'function_call',
          selector: selector,
          functionName: decoded.name,
          functionSignature: decoded.signature,
          args: decoded.args,
          argsNamed: decoded.args.reduce((acc, arg, index) => {
            acc[decoded.functionFragment.inputs[index].name] = arg;
            return acc;
          }, {}),
          gasLimit: decoded.gasLimit,
          value: decoded.value
        };
      } catch (functionError) {
        // If not function call, try to parse event log
        try {
          const topics = []; // Topics should be obtained from log
          const decoded = this.iface.parseLog({ topics, data: encodedData });

          return {
            type: 'event_log',
            eventName: decoded.name,
            eventSignature: decoded.signature,
            args: decoded.args,
            argsNamed: decoded.args.reduce((acc, arg, index) => {
              acc[decoded.eventFragment.inputs[index].name] = arg;
              return acc;
            }, {})
          };
        } catch (eventError) {
          return {
            type: 'unknown',
            selector: selector,
            data: data,
            error: 'Unable to decode as function call or event log',
            functionError: functionError.message,
            eventError: eventError.message
          };
        }
      }
    } catch (error) {
      return {
        type: 'error',
        error: error.message,
        rawData: encodedData
      };
    }
  }

  /**
   * Decode event log
   * @param {Array} topics - Event topics array
   * @param {string} data - Event data
   * @returns {Object} Decode result
   */
  decodeEvent(topics, data) {
    if (!this.iface) {
      throw new Error('ABI not loaded. Please load ABI first.');
    }

    try {
      const decoded = this.iface.parseLog({ topics, data });

      return {
        type: 'event_log',
        eventName: decoded.name,
        eventSignature: decoded.signature,
        args: decoded.args,
        argsNamed: decoded.args.reduce((acc, arg, index) => {
          acc[decoded.eventFragment.inputs[index].name] = arg;
          return acc;
        }, {}),
        topics: topics
      };
    } catch (error) {
      return {
        type: 'error',
        error: error.message,
        topics: topics,
        data: data
      };
    }
  }

  /**
   * List all available functions
   * @returns {Array} Function list
   */
  listFunctions() {
    if (!this.iface) {
      throw new Error('ABI not loaded. Please load ABI first.');
    }

    return this.iface.fragments
      .filter(fragment => fragment.type === 'function')
      .map(fragment => ({
        name: fragment.name,
        signature: fragment.format(),
        inputs: fragment.inputs,
        outputs: fragment.outputs,
        stateMutability: fragment.stateMutability
      }));
  }

  /**
   * List all available events
   * @returns {Array} Event list
   */
  listEvents() {
    if (!this.iface) {
      throw new Error('ABI not loaded. Please load ABI first.');
    }

    return this.iface.fragments
      .filter(fragment => fragment.type === 'event')
      .map(fragment => ({
        name: fragment.name,
        signature: fragment.format(),
        inputs: fragment.inputs
      }));
  }

  /**
   * Encode function call
   * @param {string} functionName - Function name
   * @param {Array} args - Arguments array
   * @returns {string} Encoded data
   */
  encodeFunctionCall(functionName, args) {
    if (!this.iface) {
      throw new Error('ABI not loaded. Please load ABI first.');
    }

    try {
      return this.iface.encodeFunctionData(functionName, args);
    } catch (error) {
      throw new Error(`Error encoding function call: ${error.message}`);
    }
  }

  /**
   * Format output result
   * @param {Object} result - Parse result
   * @returns {string} Formatted string
   */
  formatResult(result) {
    let output = '\n📋 Decode Result:\n';
    output += `   Type: ${result.type}\n`;

    if (result.type === 'function_call') {
      output += `   Function: ${result.functionName}\n`;
      output += `   Signature: ${result.functionSignature}\n`;
      output += '   Arguments:\n';

      Object.entries(result.argsNamed).forEach(([name, value]) => {
        output += `     ${name}: ${value}\n`;
      });

      if (result.gasLimit) {
        output += `   Gas Limit: ${result.gasLimit.toString()}\n`;
      }
      if (result.value) {
        output += `   Value: ${ethers.utils.formatEther(result.value)} ETH\n`;
      }
    } else if (result.type === 'event_log') {
      output += `   Event: ${result.eventName}\n`;
      output += `   Signature: ${result.eventSignature}\n`;
      output += '   Arguments:\n';

      Object.entries(result.argsNamed).forEach(([name, value]) => {
        output += `     ${name}: ${value}\n`;
      });
    } else if (result.type === 'error') {
      output += `   Error: ${result.error}\n`;
    } else if (result.type === 'unknown') {
      output += `   Selector: ${result.selector}\n`;
      output += `   Data: ${result.data}\n`;
      output += `   Error: ${result.error}\n`;
    }

    return output;
  }
}

module.exports = ABIDecoder;
