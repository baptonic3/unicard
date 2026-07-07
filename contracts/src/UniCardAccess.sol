// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title  UniCardAccess — Chain-Abstracted Access Pass Engine
/// @notice Generic access pass contract for UniCard. Supports event tickets, memberships, digital goods, and any access-gated product. 
/// @dev    Only the deployer (Admin) can create items and issue passes. Organizers enjoy a gasless experience.
contract UniCardAccess {
    address public owner;
    uint256 public nextItemId;
    uint256 public nextPassId;

    struct AccessItem {
        address creator;
        string metadataURI;   // IPFS or HTTP URL
        uint256 priceUSDC6;   // Price in USDC (6 decimals), e.g., 5_000000 = $5
        uint256 maxSupply;    // Maximum number of passes that can be issued
        uint256 currentSupply;// Number of passes currently issued
        bool active;
    }

    struct Pass {
        uint256 itemId;
        address buyer;
        string particleTxId;  // Particle UA transaction ID for cross-chain provenance
        uint256 issuedAt;
        bool used;
    }

    mapping(uint256 => AccessItem) public items;
    mapping(uint256 => Pass) public passes;
    // Stores passId + 1 so that 0 means "no pass issued yet" (sentinel pattern)
    mapping(bytes32 => uint256) public passLookup; // keccak256(buyer, itemId) => passId + 1

    event AccessItemCreated(uint256 indexed itemId, address indexed creator, string metadataURI, uint256 priceUSDC6, uint256 maxSupply);
    event PassIssued(uint256 indexed passId, uint256 indexed itemId, address indexed buyer, string particleTxId);
    event PassUsed(uint256 indexed passId);
    event ItemDeactivated(uint256 indexed itemId);

    error NotOwner();
    error ItemNotActive();
    error SupplyMaxedOut();
    error PassAlreadyIssued();
    error PassDoesNotExist();
    error PassAlreadyUsed();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Create a new access item (ticket, membership, etc.)
    /// @param metadataURI  JSON metadata URL (title, description, image)
    /// @param priceUSDC6   Price in USDC with 6 decimals (e.g., 5_000000 = $5)
    /// @param maxSupply    Maximum capacity logic enforced on-chain
    function createAccessItem(string calldata metadataURI, uint256 priceUSDC6, uint256 maxSupply) external onlyOwner returns (uint256) {
        uint256 itemId = nextItemId++;
        items[itemId] = AccessItem({
            creator: msg.sender,
            metadataURI: metadataURI,
            priceUSDC6: priceUSDC6,
            maxSupply: maxSupply,
            currentSupply: 0,
            active: true
        });
        emit AccessItemCreated(itemId, msg.sender, metadataURI, priceUSDC6, maxSupply);
        return itemId;
    }

    /// @notice Issue a pass to a buyer after Particle UA payment is confirmed
    /// @param itemId       The access item purchased
    /// @param buyer        The buyer's EOA / Universal Account address
    /// @param particleTxId The Particle transaction ID for cross-chain proof
    function issuePass(uint256 itemId, address buyer, string calldata particleTxId) external onlyOwner returns (uint256) {
        if (!items[itemId].active) revert ItemNotActive();
        if (items[itemId].currentSupply >= items[itemId].maxSupply) revert SupplyMaxedOut();

        bytes32 key = keccak256(abi.encodePacked(buyer, itemId));
        if (passLookup[key] != 0) revert PassAlreadyIssued();

        items[itemId].currentSupply++;

        uint256 passId = nextPassId++;
        passes[passId] = Pass({
            itemId: itemId,
            buyer: buyer,
            particleTxId: particleTxId,
            issuedAt: block.timestamp,
            used: false
        });
        passLookup[key] = passId + 1; // +1 so 0 always means "not issued"

        emit PassIssued(passId, itemId, buyer, particleTxId);
        return passId;
    }

    /// @notice Mark a pass as used 
    function usePass(uint256 passId) external onlyOwner {
        if (passes[passId].buyer == address(0)) revert PassDoesNotExist();
        if (passes[passId].used) revert PassAlreadyUsed();
        passes[passId].used = true;
        emit PassUsed(passId);
    }

    /// @notice Deactivate an access item (no new passes can be issued)
    function deactivateItem(uint256 itemId) external onlyOwner {
        items[itemId].active = false;
        emit ItemDeactivated(itemId);
    }

    /// @notice Check if a buyer has a pass for a specific item
    function hasPass(address buyer, uint256 itemId) external view returns (bool) {
        bytes32 key = keccak256(abi.encodePacked(buyer, itemId));
        return passLookup[key] != 0;
    }

    /// @notice Get pass details by buyer + item
    function getPassByBuyerItem(address buyer, uint256 itemId) external view returns (Pass memory) {
        bytes32 key = keccak256(abi.encodePacked(buyer, itemId));
        return passes[passLookup[key] - 1]; // -1 to reverse the sentinel offset
    }
}
