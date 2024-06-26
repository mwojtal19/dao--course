import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, MIN_DELAY } from "../hardhat-config-helper";
import { verify } from "../utils/verify";

const deployTimeLock: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const accounts = await ethers.getSigners();
    const deployer = accounts[0];
    const chainId = hre.network.config.chainId!;

    const args: any[] = [MIN_DELAY, [], []];
    const timeLock = await hre.deployments.deploy("TimeLock", {
        from: deployer.address,
        args: args,
        log: true,
        waitConfirmations: 1,
    });
    if (!developmentChains.includes(chainId) && process.env.ETHERSCAN_API_KEY) {
        await verify(timeLock.address, args);
    }
    hre.deployments.log("---------------------------------");
};

export default deployTimeLock;
deployTimeLock.tags = ["all", "timeLock"];
