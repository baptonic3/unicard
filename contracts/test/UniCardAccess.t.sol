// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {UniCardAccess} from "../src/UniCardAccess.sol";

contract UniCardAccessTest is Test {
    UniCardAccess public uc;
    address public owner = address(this);
    address public buyer = address(0xBEEF);
    address public buyer2 = address(0xCAFE);
    address public notOwner = address(0xDEAD);

    function setUp() public {
        uc = new UniCardAccess();
    }

    // ---- Access Item Tests ----

    function test_CreateAccessItem() public {
        uint256 itemId = uc.createAccessItem("https://example.com/ticket.json", 5_000000, 100);
        assertEq(itemId, 0);
        assertEq(uc.nextItemId(), 1);

        (address creator, string memory uri, uint256 price, uint256 maxSupply, uint256 currentSupply, bool active) = uc.items(0);
        assertEq(creator, owner);
        assertEq(uri, "https://example.com/ticket.json");
        assertEq(price, 5_000000);
        assertEq(maxSupply, 100);
        assertEq(currentSupply, 0);
        assertTrue(active);
    }

    function test_CreateMultipleItems() public {
        uc.createAccessItem("item0", 1_000000, 50);
        uc.createAccessItem("item1", 2_000000, 200);
        assertEq(uc.nextItemId(), 2);
    }

    function test_CreateAccessItem_RevertNotOwner() public {
        vm.prank(notOwner);
        vm.expectRevert(UniCardAccess.NotOwner.selector);
        uc.createAccessItem("test", 1_000000, 10);
    }

    // ---- Pass Issuance Tests ----

    function test_IssuePass() public {
        uc.createAccessItem("ticket", 5_000000, 100);
        uint256 passId = uc.issuePass(0, buyer, "particle_tx_123");

        assertEq(passId, 0);
        assertEq(uc.nextPassId(), 1);
        assertTrue(uc.hasPass(buyer, 0));

        // Verify currentSupply incremented
        (, , , , uint256 currentSupply, ) = uc.items(0);
        assertEq(currentSupply, 1);

        (uint256 itemId, address passBuyer, string memory txId, uint256 issuedAt, bool used) = uc.passes(0);
        assertEq(itemId, 0);
        assertEq(passBuyer, buyer);
        assertEq(txId, "particle_tx_123");
        assertGt(issuedAt, 0);
        assertFalse(used);
    }

    function test_IssuePass_RevertDuplicate() public {
        uc.createAccessItem("ticket", 5_000000, 100);
        uc.issuePass(0, buyer, "tx1");

        vm.expectRevert(UniCardAccess.PassAlreadyIssued.selector);
        uc.issuePass(0, buyer, "tx2");
    }

    function test_IssuePass_RevertInactiveItem() public {
        uc.createAccessItem("ticket", 5_000000, 100);
        uc.deactivateItem(0);

        vm.expectRevert(UniCardAccess.ItemNotActive.selector);
        uc.issuePass(0, buyer, "tx1");
    }

    function test_IssuePass_RevertNotOwner() public {
        uc.createAccessItem("ticket", 5_000000, 100);

        vm.prank(notOwner);
        vm.expectRevert(UniCardAccess.NotOwner.selector);
        uc.issuePass(0, buyer, "tx1");
    }

    // ---- Supply Limit Tests ----

    function test_IssuePass_RevertSupplyMaxedOut() public {
        // Create item with maxSupply of 1
        uc.createAccessItem("limited-ticket", 5_000000, 1);

        // First buyer succeeds
        uc.issuePass(0, buyer, "tx_first");
        assertTrue(uc.hasPass(buyer, 0));

        // Second buyer fails — supply exhausted
        vm.expectRevert(UniCardAccess.SupplyMaxedOut.selector);
        uc.issuePass(0, buyer2, "tx_second");
    }

    function test_SupplyTracking() public {
        uc.createAccessItem("event", 2_000000, 3);

        uc.issuePass(0, address(0x0001), "tx_1");
        uc.issuePass(0, address(0x0002), "tx_2");
        uc.issuePass(0, address(0x0003), "tx_3");

        // Verify currentSupply == maxSupply
        (, , , uint256 maxSupply, uint256 currentSupply, ) = uc.items(0);
        assertEq(currentSupply, 3);
        assertEq(currentSupply, maxSupply);

        // Fourth buyer should be reverted — supply is exhausted
        vm.expectRevert(UniCardAccess.SupplyMaxedOut.selector);
        uc.issuePass(0, address(0x0004), "tx_overflow");
    }

    // ---- Pass Usage Tests ----

    function test_UsePass() public {
        uc.createAccessItem("ticket", 5_000000, 100);
        uc.issuePass(0, buyer, "tx1");
        uc.usePass(0);

        (, , , , bool used) = uc.passes(0);
        assertTrue(used);
    }

    function test_UsePass_RevertAlreadyUsed() public {
        uc.createAccessItem("ticket", 5_000000, 100);
        uc.issuePass(0, buyer, "tx1");
        uc.usePass(0);

        vm.expectRevert(UniCardAccess.PassAlreadyUsed.selector);
        uc.usePass(0);
    }

    function test_UsePass_RevertNotExists() public {
        vm.expectRevert(UniCardAccess.PassDoesNotExist.selector);
        uc.usePass(999);
    }

    // ---- View Tests ----

    function test_HasPass_False() public {
        uc.createAccessItem("ticket", 5_000000, 100);
        assertFalse(uc.hasPass(buyer, 0));
    }

    function test_GetPassByBuyerItem() public {
        uc.createAccessItem("ticket", 5_000000, 100);
        uc.issuePass(0, buyer, "tx_abc");

        UniCardAccess.Pass memory p = uc.getPassByBuyerItem(buyer, 0);
        assertEq(p.itemId, 0);
        assertEq(p.buyer, buyer);
        assertEq(keccak256(bytes(p.particleTxId)), keccak256(bytes("tx_abc")));
    }

    // ---- Deactivation Tests ----

    function test_DeactivateItem() public {
        uc.createAccessItem("ticket", 5_000000, 100);
        uc.deactivateItem(0);

        (, , , , , bool active) = uc.items(0);
        assertFalse(active);
    }

    // ---- Event Tests ----

    function test_EmitAccessItemCreated() public {
        vm.expectEmit(true, true, false, true);
        emit UniCardAccess.AccessItemCreated(0, owner, "ticket", 5_000000, 100);
        uc.createAccessItem("ticket", 5_000000, 100);
    }

    function test_EmitPassIssued() public {
        uc.createAccessItem("ticket", 5_000000, 100);

        vm.expectEmit(true, true, true, true);
        emit UniCardAccess.PassIssued(0, 0, buyer, "tx1");
        uc.issuePass(0, buyer, "tx1");
    }

    function test_EmitPassUsed() public {
        uc.createAccessItem("ticket", 5_000000, 100);
        uc.issuePass(0, buyer, "tx1");

        vm.expectEmit(true, false, false, false);
        emit UniCardAccess.PassUsed(0);
        uc.usePass(0);
    }
}
