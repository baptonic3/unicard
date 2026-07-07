// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {UniCardAccess} from "../src/UniCardAccess.sol";

contract DeployUniCardAccess is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerKey);

        UniCardAccess uc = new UniCardAccess();
        console.log("UniCardAccess deployed at:", address(uc));

        // Seed the first access item: "UniCard Launch Party" at $5 USDC, max 100 tickets
        uc.createAccessItem(
            "https://unicard.app/api/metadata/launch-party",
            5_000000, // $5 USDC (6 decimals)
            100       // max 100 tickets
        );
        console.log("Seeded item 0: Launch Party ($5 USDC, 100 tickets max)");

        vm.stopBroadcast();
    }
}
