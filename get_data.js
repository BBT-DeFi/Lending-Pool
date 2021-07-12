// var Web3 = require('web3');
// var web3 = new Web3('HTTP://127.0.0.1:7545');

// var {abi}=require('../build/contracts/Pool_USDT.json')
// var contractAddress = "0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0"
// var contractObject=new web3.eth.Contract(abi, contractAddress)

// async function getBalanceInPool () {
//     //var BalanceInPool="Try";
//     console.log(contractObject.methods)
//     var BalanceInPool = await contractObject.methods.getTotalBorrowAmount().call()
//     console.log(BalanceInPool)
//     return BalanceInPool

// }
// ;

// getBalanceInPool().catch('Error')

var Web3 = require('web3');
var web3 = new Web3('http://127.0.0.1:9545');
var abi_contract = require('../build/contracts/Pool_USDT.json')
var abi_token = require('../build/contracts/USDT2.json')

var contractAddress = "0x5679f4B95F79DCf19C160fAaf807E9f8eFF2050f";
var tokenAddress ="0xC0322dF6e4aBe196cAD2e505372975D34C99548e";

//var lender="0x785ed57d25b48a0c5df5f7c89743c172022fe768"; //account1
var lender="0x785ed57d25b48a0c5df5f7c89743c172022fe768";
var borrower="0xa3d115561c2ab08b7d00282d6faae6372ecfcd8c"; //account2

var tokenObject = new web3.eth.Contract(abi_token.abi, tokenAddress)
var contractObject = new web3.eth.Contract(abi_contract.abi, contractAddress)
//var contractObject_2 = new web3.eth.Contract(abi_contract.abi, contractAddress)
// console.log(contractObject)

async function getBalanceOfToken() {
    try {
        var sender = await contractObject.methods.getMsgSender().call();
        var result  = await tokenObject.methods.balanceOf(sender).call()
    console.log(`Token holder: ${sender} Token Address: ${tokenAddress} Balance of Token: ${result}`)
    return result}
    catch {console.log("Cannot return balance")}
}

async function getBalanceOfToken_2(addr) {
    try {
        //var sender = await contractObject.methods.getMsgSender().call();
        var result  = await tokenObject.methods.balanceOf(addr).call()
    console.log(`Token holder: ${addr} Token Address: ${tokenAddress} Balance of Token: ${result}`)
    return result}
    catch {console.log("Cannot return balance")}
}

async function getTotalBorrowAmount() {
    var result  = await contractObject.methods.getTotalBorrowAmount().call()
    console.log(`Total Borrow Amount: ${result}`)
    return result
}
async function getBorrowBalance() {
    var result  = await contractObject.methods.getBorrowBalance().call();
    var addr = await contractObject.methods.getMsgSender().call();
    console.log(`Borrow balance of ${addr} : ${result}`)
    return result
}

async function getTotalBorrowAmount() {
    var result  = await contractObject.methods.getTotalBorrowAmount().call()
    console.log(`Total Borrow Amount in the system is : ${result}`);
    return result
}

async function getPortionOfBorrowAmount() {
    var result  = await contractObject.methods.getPortionOfBorrowAmount().call()
    console.log(`Portion of ${addr} borrow from all tokens: ${result}`);
    return result
}

async function approveBorrow(tokenaddr, borroweraddr,amount, interval) {
    var result  = await contractObject.methods.approveBorrow(tokenaddr, borroweraddr,amount, interval).call()
    console.log(`Approve: ${result}`);
    return result
}

async function getHealthFactor() {
    var result  = await contractObject.methods.getHealthFactor().call()
    var addr = await contractObject.methods.getMsgSender().call();
    console.log(`Healthfactor of ${addr} : ${result}`)
    return result
}

async function getBalanceInPool() {
    var result  = await contractObject.methods.getBalanceInPool().call()
    var addr = await contractObject.methods.getMsgSender().call();
    console.log(`Balance of ${addr} in pool is : ${result}`);
    return result
}


async function getTotalRepayInterest() {
    var result  = await contractObject.methods.getTotalRepayInterest().call()
    console.log(`Total repay interest of this pool: ${result}`)
    return result
}

async function getAllowance() {
    var sender = await contractObject.methods.getMsgSender().call();
    var result  = await tokenObject.methods.allowance(sender, contractAddress).call()
    console.log(`Allowance: ${result}`)
    return result
}

async function approveDeposit(amount) {
    var sender = await contractObject.methods.getMsgSender().call();
    await tokenObject.methods.approve(contractAddress, amount).send({from:sender});
}

async function depositToken(tokenaddr, amount) {
    var tokenaddr = tokenaddr;
    var amount = amount;
    var sender = await contractObject.methods.getMsgSender().call();
    try {
        await contractObject.methods.depositToken(tokenaddr, amount).send({from:sender, gasPrice:"10000000000", gas:100000});
        var totalsup = await contractObject.methods.getContractTotalSupply(tokenaddr).call();
    await console.log(`${sender} Deposit ${tokenaddr} into pool for : ${amount} now ${totalsup}`);
    return amount}
    catch(err) {
        // catches errors both in fetch and response.json
        console.log("Error in Deposit Token "+err);
      }
    // return totalsup

}

async function transferFrom(amount) {
    try {var sender = await contractObject.methods.getMsgSender().call();
    var result  = await tokenObject.methods.transferFrom(sender, contractAddress, amount).send({from:sender})
    console.log(`Transfer: ${result}`)
    return result}
    catch(err) {
        console.log('cannot transfer '+amount+'From '+sender+' because ' + err);
    }
}

async function withdrawToken(tokenaddr, amount) {
    var tokenaddr = tokenaddr;
    var amount = amount;
    try {var sender = await contractObject.methods.getMsgSender().call();
    await contractObject.methods.withdrawToken(tokenaddr, amount).send({from:sender, gasPrice:1});
    var totalsup = await contractObject.methods.getContractTotalSupply(tokenaddr).call()
    await console.log(`${sender} Withdraw ${tokenaddr} into pool for : ${amount} now ${totalsup}`)}
    catch(err) {
        // catches errors both in fetch and response.json
        console.log("Error in Withdraw Token "+err);
      }
    // return totalsup

}

async function borrowToken(tokenaddr, amount, interval) {
    var tokenaddr = tokenaddr;
    var amount = amount;
   try { var sender = await contractObject.methods.getMsgSender().call();
    await contractObject.methods.borrowToken(tokenaddr, amount).send({from:sender, gasPrice:1});
    var totalsup = await contractObject.methods.getContractTotalSupply(tokenaddr).call()
    await console.log(`${sender} borrow ${tokenaddr} for : ${amount} Return interval:  ${interval}`)}
    catch(err) {
        // catches errors both in fetch and response.json
        console.log("Error in Withdraw Token "+err);
      }

}

async function repayToken(tokenaddr, amount) {
    var tokenaddr = tokenaddr;
    var amount = amount;
    try {await contractObject.methods.returnToken(tokenaddr, amount).send({from:sender, gasPrice:1});
    await console.log(`${sender} Repay ${tokenaddr} for : ${amount}`)}
    catch(err) {
        // catches errors both in fetch and response.json
        console.log("Error in Repay Token "+err);
      }
}

async function getEtherBalance(lenderaddr){
    var etherBalance = await web3.eth.getBalance(lenderaddr)
    console.log(etherBalance)
 }
 
approveDeposit(100)
// //  getTotalBorrowAmount()
// // // getBorrowBalance()
// // //getHealthFactor()
// // getBalanceOfToken()
// getEtherBalance(lender)
getAllowance()

//getBalanceOfToken_2("0x785ed57d25b48a0c5df5f7c89743c172022fe768")
transferFrom(1)
//depositToken(tokenAddress, 100)
getBalanceOfToken()

