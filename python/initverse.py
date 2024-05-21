from eth_account import Account
from web3 import Web3, HTTPProvider

w3 = Web3(HTTPProvider("https://rpc-testnet.iniscan.com"))

# Generate a new account using the eth_account library.
def generateAccount():
    account = Account.create()

    private_key = account._private_key.hex()
    address = account.address
    return {"address": address, "private_key": private_key}
 

def signTx():
    pk = 'a2869747c17450804f3eceed4d28f2aaec4cba1159baaac1ff2aba9747174578'
    to_addr = "0x70A1a0f297c531e9424c5e9C6Bf11af5A20E6701"
    
    acct2 = w3.eth.account.from_key(pk)
    
    #1. build the transaction
    transaction = {
        "from": acct2.address,
        "to": to_addr,
        "value": w3.to_wei(0.1,'ether'),
        "nonce": w3.eth.get_transaction_count(acct2.address),
        "gasPrice": (w3.eth.gas_price + 100000),
        "gas": 21000,   
        "chainId": 233,  # 233 for initverse testnet
    }
    
    #2. sign the transaction
    signed = w3.eth.account.sign_transaction(transaction, pk)
    
    hash = signed.hash.hex()
    print("hash:", hash)

    #3. serialize and deserialize the transaction
    return signed.rawTransaction.hex()

# Send the signed transaction to the network.
def sendRawTx(rawTx):
    tx_hash = w3.eth.send_raw_transaction(rawTx)
    return tx_hash.hex()
    

def main():
    account = generateAccount()
    print("Address:", account["address"])
    print("Private Key:", account["private_key"])
    print("==============================================")
    rawTx = signTx()
    print("rawTx:" , rawTx)
    print("==============================================")
    tx_hash = sendRawTx(rawTx)
    print("Transaction Hash:", tx_hash)

if __name__ == "__main__":
    main()