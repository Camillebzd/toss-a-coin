import { ethers, network, run } from "hardhat";

async function main() {
  console.log("Deploying...");
  const TossACoin = await ethers.getContractFactory("TossACoin");
  const tossACoin = await TossACoin.deploy();
  console.log("Deployed!");
  console.log(`TossACoin address: ${await tossACoin.getAddress()}`);
  console.log(`Transaction hash: ${tossACoin.deploymentTransaction()?.hash}`);

  if (network.config.chainId !== 31337 && network.config.chainId != undefined && process.env.ETHERSCAN_API_KEY) {
    console.log(network.config.chainId);
    console.log("Waiting for blocks confirmations...");
    await tossACoin.deploymentTransaction()?.wait(6);
    console.log("Confirmed!");
    await verify(await tossACoin.getAddress(), []);
  }

}

const verify = async (contractAddress: string, args: any[]) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
