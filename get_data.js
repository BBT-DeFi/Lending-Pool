var Web3 = require('web3');
var web3 = new Web3('http://127.0.0.1:9545');
var abi_contract = require('../build/contracts/Pool_USDT.json')
var abi_token = require('../build/contracts/USDT2.json')

var contractAddress = "0x59EA919636098A9E87869530015cbFaBB47c9f7c";
var tokenAddress ="0xd4A7a050CaA9770F915Aeb742DF6e21887631BDD";

var account0="0x785ed57d25b48a0c5df5f7c89743c172022fe768"; //lender
var account1="0xa3d115561c2ab08b7d00282d6faae6372ecfcd8c"; //borrower

var tokenObject = new web3.eth.Contract(abi_token.abi, tokenAddress)
var contractObject = new web3.eth.Contract(abi_contract.abi, contractAddress)
//var contractObject_2 = new web3.eth.Contract(abi_contract.abi, contractAddress)
// console.log(contractObject)

// var contract;
// Contract.deployed()
// .then(function(response) {
//   contract = response;
//   return contract.function(arg1, arg2, {from: borrower}); // send txn from 2nd account

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
    try {var result  = await contractObject.methods.getBorrowBalance().call({from:account1});
    var addr = await contractObject.methods.getMsgSender().call({from:account1});
    console.log(`Borrow balance of ${addr} : ${result}`)}
    catch(err) {
        console.log("Error get borrow balance "+err);
      }
    return result
}

async function getTotalBorrowAmount() {
    try {var result  = await contractObject.methods.getTotalBorrowAmount().call()
    console.log(`Total Borrow Amount in the system is : ${result}`);}
    catch(err) {
        console.log("Error in getTotalBorrowAmount "+err);
      }
    return result
}

async function getPortionOfBorrowAmount() {
    try {var result  = await contractObject.methods.getPortionOfBorrowAmount().call()
    console.log(`Portion of ${addr} borrow from all tokens: ${result}`);}
    catch(err) {
        console.log("Error in getPortionofBorrowAmount "+err);
      }
    return result
}

async function approveBorrow(tokenaddr, borroweraddr,amount, interval) { //******* */
    try {var borrower = await borroweraddr;
        var result  = await contractObject.methods.approveBorrow(tokenaddr, borroweraddr,amount, interval).call()
        //await tokenObject.methods.approve(contractAddress, amount).send({from:account0});
        //await tokenObject.methods.approve(borrower, amount).send({from:account0});
    console.log(`Approve Borrower: ${borroweraddr} amount:  ${amount} Interval : ${interval} Status : ${result}`);}
    
    catch(err) {
        console.log("Error in approveBorrow "+err);
      }

    return result
}

async function getHealthFactor() {
    try {var result  = await contractObject.methods.getHealthFactor().call({from:account1})
    var addr = await contractObject.methods.getMsgSender().call({from:account1});
    console.log(`Healthfactor of ${addr} : ${result}`)}
    catch(err) {
        console.log("Error in getHealthFactor "+err);
      }
    return result
}

async function getBalanceInPool() {
    try {var result  = await contractObject.methods.getBalanceInPool().call()
    var addr = await contractObject.methods.getMsgSender().call();
    console.log(`Balance of ${addr} in pool is : ${result}`);}
    catch(err) {
        console.log("Error getBalanceinPool "+err);
      }
    return result
}


async function getTotalRepayInterest() {
    try {var result  = await contractObject.methods.getTotalRepayInterest().call()
    console.log(`Total repay interest of this pool: ${result}`)}
    catch(err) {
        console.log("Error in getTotalRepayInterest"+err);
      }
    return result
}

async function getAllowance() {
    var sender = await contractObject.methods.getMsgSender().call();
    var result  = await tokenObject.methods.allowance(sender, contractAddress).call()
    console.log(`Address ${contractAddress} Allowance: ${result}`)
    return result
}

async function approveDeposit(amount) {
    var sender = await contractObject.methods.getMsgSender().call();
    await tokenObject.methods.approve(contractAddress, amount).send({from:sender});
}


// async function approveDeposit(amount) {
//     var sender = await contractObject.methods.getMsgSender().call();
//     await tokenObject.methods.approve(contractAddress, amount).send({from:sender});
// }

async function depositToken(tokenaddr, amount) {
    var tokenaddr = tokenaddr;
    var amount = amount;
    var sender = await contractObject.methods.getMsgSender().call();
    var gaslimit = await getEstimateedGasLimitDepositToken(tokenAddress,amount);
    var gasprice = await getGasPrice();
    try {
        await contractObject.methods.depositToken(tokenaddr, amount).send({from:sender, gasPrice:gasprice, gas:gaslimit});
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
    try {var gaslimit = await getEstimateedGasLimitTransferToken(tokenAddress,amount);
        var gasprice = await getGasPrice();
        var sender = await contractObject.methods.getMsgSender().call();
    var result  = await tokenObject.methods.transferFrom(sender, contractAddress, amount).send({from:sender, gasPrice:gasprice, gas:gaslimit})
    console.log(`Transfer: ${result}`)
    return result}
    catch(err) {
        console.log('cannot transfer '+amount+'From '+sender+' because ' + err);
    }
}

async function withdrawToken(tokenaddr, amount) {
    var tokenaddr = tokenaddr;
    var amount = amount;
    var gaslimit = await getEstimateedGasLimitWithdrawToken(tokenAddress,amount);
    var gasprice = await getGasPrice();
    try {var sender = await contractObject.methods.getMsgSender().call();
    await contractObject.methods.withdrawToken(tokenaddr, amount).send({from:sender, gasprice:gasprice, gas:gaslimit});
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
    var gaslimit = await getEstimateedGasLimitBorrowToken(tokenAddress,amount, interval);
    var gasprice = await getGasPrice();
   try { var sender = await contractObject.methods.getMsgSender().call({from:account1});
    await contractObject.methods.borrowToken(tokenaddr, amount, interval).send({from:sender, gasPrice:gasprice, gas:gaslimit});
    var totalsup = await contractObject.methods.getContractTotalSupply(tokenaddr).call()
    await console.log(`borrowToken completed. Borrower: ${sender} borrow ${tokenaddr} for : ${amount} Return interval:  ${interval}`)}
    catch(err) {
        // catches errors both in fetch and response.json
        console.log("Error in Borrow Token "+err);
      }

}

async function repayToken(tokenaddr, amount) {
    var tokenaddr = tokenaddr;
    var amount = amount;
    var sender = await contractObject.methods.getMsgSender().call({from:account1});
    var gaslimit = await getEstimateedGasLimitRepayToken(tokenAddress,amount);
    var gasprice = await getGasPrice();
    try {await contractObject.methods.repayToken(tokenaddr, amount).send({from:account1, gasPrice:gasprice, gas:gaslimit});
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

 async function getSender(role){
    var role = role;
    if (role=="lender") {var sender = await contractObject.methods.getMsgSender().call({from:account0})}
    else {var sender = await contractObject.methods.getMsgSender().call({from:account1})}
    console.log(sender)
 }
 
async function getEstimateedGasLimitDepositToken(tokenaddr, amount) {
    try { var sender = await contractObject.methods.getMsgSender().call();
        var result = await contractObject.methods.depositToken(tokenaddr, amount).estimateGas({from:sender});
    await console.log("Account: "+ sender+" Estimated Gas Limit for Deposit Token is "+ result)}
    catch(err) {
        console.log("Cannot get Gas Limit for depositToken " + err)
    }
    return result;

}

async function getEstimateedGasLimitTransferToken(tokenaddr, amount) {
    try { var sender = await contractObject.methods.getMsgSender().call();
        var result = await contractObject.methods.transferFrom(tokenaddr, amount).estimateGas({from:sender});
    await console.log("Account:"+ sender+" Estimated Gas Limit for transferToken is "+ result)}
    catch(err) {
        console.log("Cannot get Gas Limit for transferToken " + err)
    }
    return result;

}

async function getEstimateedGasLimitWithdrawToken (tokenaddr, amount) {
    try { var sender = await contractObject.methods.getMsgSender().call();
        var result = await contractObject.methods.withdrawToken(tokenaddr, amount).estimateGas({from:sender});
    await console.log("Account:"+ sender+" Estimated Gas Limit for withdrawToken is "+ result)}
    catch(err) {
        console.log("Cannot get Gas Limit for withdrawToken " + err)
    }
    return result;

}

async function getEstimateedGasLimitBorrowToken(tokenaddr, amount, interval) {
    try { var sender = await contractObject.methods.getMsgSender().call({from:account1});
        var result = await contractObject.methods.borrowToken(tokenaddr, amount, interval).estimateGas({from:sender});
    await console.log("Account:"+ sender+" Estimated Gas Limit for borrowToken is "+ result)}
    catch(err) {
        console.log("Cannot get Gas Limit for borrowToken " + err)
    }
    return result;
}

async function getEstimateedGasLimitRepayToken(tokenaddr, amount) {
    try { var sender = await contractObject.methods.getMsgSender().call({from:account1});
        var result = await contractObject.methods.repayToken(tokenaddr, amount).estimateGas({from:sender});
    await console.log("Account:"+ sender+" Estimated Gas Limit for repayToken is "+ result)}
    catch(err) {
        console.log("Cannot get Gas Limit for repayToken " + err)
    }
    return result;

}

async function getGasPrice() {
    try { var result = await web3.eth.getGasPrice()
    await console.log(" Gas Price is "+ result)}
    catch(err) {
        console.log("Cannot get Gas Price " + err)
    }
    return result;

}


//approveDeposit(100)
// //  getTotalBorrowAmount()
// // // getBorrowBalance()
// // //getHealthFactor()
// // getBalanceOfToken()
// getEtherBalance(lender)

//depositToken(tokenAddress, 100)
//getEstimateedGasLimitRepayToken(tokenAddress, 20)

//withdrawToken(tokenAddress, 20)

//getBalanceOfToken()

//approveBorrow(tokenAddress, account1, 20, 10)
//getAllowance()

//borrowToken(tokenAddress,20,10)

//getBorrowBalance()

//getSender("borowwer")

//repayToken(tokenAddress,20)
//getBalanceOfToken_2(account1)
//getBalanceInPool()

//getBorrowBalance()
//getGasPrice(tokenAddress,10)
getHealthFactor()
