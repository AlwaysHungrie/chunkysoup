import { config } from '../config'
import { ChunkyNft__factory } from '../typechain-types'
import { ethers } from 'ethers'

const {
  CONTRACT_ADDRESS,
  CONTRACT_TYPE_PATH,
  OWNER_ADDRESS,
  OWNER_PRIVATE_KEY,
  BASE_SEPOLIA_RPC_URL,
} = config

const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC_URL)
const wallet = new ethers.Wallet(OWNER_PRIVATE_KEY, provider)

const contract = ChunkyNft__factory.connect(CONTRACT_ADDRESS, wallet)

export const mintNft = async (address: string, metadataUrl: string) => {
  console.log('provider', provider)
  const unsignedTx = await contract.mintAndTransfer.populateTransaction(address, metadataUrl)
  const txnRequest = {
    to: CONTRACT_ADDRESS,
    data: unsignedTx.data,
    value: unsignedTx.value || 0,
    gasLimit: unsignedTx.gasLimit,
  }
  return {
    txnRequest,
    rpcUrl: BASE_SEPOLIA_RPC_URL,
  }
  // const receipt = await tx.wait()
  // if (!receipt) {
  //   throw new Error('Transaction failed')
  // }
  
  // const logs = receipt.logs
  // console.log('logs', logs)

  // const mintedEvent = receipt?.logs
  //   .filter(log => log.topics[0] === contract.interface.getEvent("NFTMinted").topicHash)
  //   .map(log => contract.interface.parseLog(log))[0];

  // console.log('mintedEvent', mintedEvent)

  // const tokenId = mintedEvent?.args[0].toString()
  // const txnHash = receipt?.logs[0].transactionHash
  // return { txnHash, tokenId }
}

export const burnNft = async (tokenId: string) => {
  const tx = await contract.burnNFT(BigInt(tokenId))
  const receipt = await tx.wait()
  if (!receipt) {
    throw new Error('Transaction failed')
  }

  const logs = receipt.logs
  console.log('logs', logs)

  const txnHash = receipt?.logs[0].transactionHash
  return { txnHash }
}