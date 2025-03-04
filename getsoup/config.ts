import dotenv from "dotenv";

dotenv.config();

const IAWS_ACCESS_KEY_ID = process.env.IAWS_ACCESS_KEY_ID;
const IAWS_SECRET_ACCESS_KEY = process.env.IAWS_SECRET_ACCESS_KEY;
const IAWS_REGION = process.env.IAWS_REGION;
const IS3_BUCKET_NAME = process.env.IS3_BUCKET_NAME;

if (!IAWS_ACCESS_KEY_ID || !IAWS_SECRET_ACCESS_KEY || !IAWS_REGION || !IS3_BUCKET_NAME) {
  throw new Error("Missing AWS credentials or region or S3 bucket name");
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API key");
}

const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!OWNER_PRIVATE_KEY || !OWNER_ADDRESS || !CONTRACT_ADDRESS) {
  throw new Error("Missing owner private key or address or contract address");
}

const CONTRACT_TYPE_PATH = process.env.CONTRACT_TYPE_PATH || './chunky-smartcontracts/typechain-types/contracts/ChunkyNft.ts';
const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL;

if (!BASE_SEPOLIA_RPC_URL) {
  throw new Error("Missing Base Sepolia RPC URL");
}

export const config = {
  IAWS_ACCESS_KEY_ID,
  IAWS_SECRET_ACCESS_KEY,
  IAWS_REGION,
  IS3_BUCKET_NAME,
  OPENAI_API_KEY,
  OWNER_PRIVATE_KEY,
  OWNER_ADDRESS,
  CONTRACT_ADDRESS,
  CONTRACT_TYPE_PATH,
  BASE_SEPOLIA_RPC_URL,
};
