#!/usr/bin/env node

Web3 = require('web3');

console.log(Web3);

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

console.log(web3.eth.accounts);

fs = require("fs");

code = fs.readFileSync('CrowdfundedCharity.sol').toString();

solc = require('solc');

console.log(solc);

compiledCode = solc.compile(code);

abiDefinition = JSON.parse(compiledCode.contracts[':CrowdfundedCharity'].interface);
CharityContract = web3.eth.contract(abiDefinition);

byteCode = compiledCode.contracts[':CrowdfundedCharity'].bytecode;

deployedContract = CharityContract.new(['1.0.3'],{data: byteCode, from: web3.eth.accounts[0], gas: 4700000})

console.log(deployedContract.address);

contractInstance = CharityContract.at(deployedContract.address)
