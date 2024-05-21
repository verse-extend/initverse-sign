
const EthereumJSWallet = require('ethereumjs-wallet'); //version ^1.0.2
const Web3 = require('web3').Web3; //version ^4.8.0
const utils = require('web3').utils; //version ^4.8.0
const EthereumTx = require('ethereumjs-tx').Transaction //version ^2.1.2
const Common = require('ethereumjs-common').default;
const ethUtil = require('ethereumjs-util');


//Generate wallet account
function generateAccount(){
    const wallet = EthereumJSWallet.default.generate();
    const address = wallet.getAddressString();
    const publicKey = wallet.getPublicKeyString();
    const privateKey = wallet.getPrivateKeyString();

    console.log('Address: ', address);
    console.log('publicKey: ', publicKey);
    console.log('Private Key: ', privateKey);
}


//Transaction signature
function signTx(chainid,privkey,nonce,gasprice,gaslimit,toaddress,value){
    const privateKey = Buffer.from(
        privkey,
    'hex',
    )

    const customCommon = Common.forCustomChain('mainnet', {
        name: 'initverse-testnet',
        networkId: 1,
        chainId: 233, 
    }, 'petersburg');

    const txParams = {
        nonce: utils.fromDecimal(nonce),
        gasPrice: utils.fromDecimal(gasprice),
        gasLimit: utils.fromDecimal(gaslimit),
        to: toaddress,
        value: utils.fromDecimal(value),
        data: '0x',
        chainId: 233,
    }

    const tx = new EthereumTx(txParams, { common: customCommon })
    tx.sign(privateKey)
    const serializedTx = tx.serialize()
    //Calculate the hash of the signature result
    const hash = ethUtil.keccak256(serializedTx).toString('hex')
    console.log("hash:",hash)
    return '0x'+serializedTx.toString('hex');
}


//Send signature results
function sendRawTx(rawTx){
    const web3 = new Web3('https://rpc-testnet.iniscan.com');
    web3.eth.sendSignedTransaction(rawTx)
    .on('receipt', console.log)
    .catch(console.error);
}



generateAccount()

const rawTx = signTx("233","a2869747c17450804f3eceed4d28f2aaec4cba1159baaac1ff2aba9747174578",'313','1000000000','21000','0x72052EA08ca2aBBDa6BC46D261E526F7dFF3794c',utils.toWei(1,"ether"))
console.log("rawTx:",rawTx)

sendRawTx(rawTx)
