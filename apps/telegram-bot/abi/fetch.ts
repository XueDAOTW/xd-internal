import fs from "fs";
import deployments from "./deployments.json";

interface ApiResponse {
  status: string;
  message: string;
  result: string;
}

async function fetchAndSaveABI() {
  const baseAddress = deployments.base.address;
  const explorer = deployments.base.explorer;
  const apiKey = process.env.BASESCAN_API_KEY;
  const url = `${explorer}/api?module=contract&action=getabi&address=${baseAddress}&apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching ABI: ${response.statusText}`);
    }
    const data = (await response.json()) as ApiResponse;
    if (data.status !== "1") {
      throw new Error(`Error in response data: ${data.message}`);
    }
    const formattedABI = JSON.stringify(JSON.parse(data.result), null, 2);
    fs.writeFileSync(`${__dirname}/XueDAOCoreContributor.abi`, formattedABI);
    console.log("ABI saved successfully.");
  } catch (error) {
    console.error("Failed to fetch and save ABI:", error);
  }
}

fetchAndSaveABI();
