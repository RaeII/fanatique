// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FanatiqueCards
 * @dev NFT contract for Fanatique betting cards
 * All card metadata stored on IPFS
 */
contract FanatiqueCards {
    // Token name and symbol
    string public constant name = "Fanatique Cards";
    string public constant symbol = "FCARD";
    
    // Owner of the contract
    address public owner;
    
    // Token ID counter
    uint256 private _tokenIdCounter;
    
    // Card rarities enum
    enum Rarity { COMMON, RARE, LEGENDARY }

    // Card structure
    struct Card {
        uint8 cardId;          // Card template ID (1-5)
        Rarity rarity;         // Card rarity
        uint32 mintedAt;       // Timestamp when minted
        bool isActive;         // If card is active/usable
    }

    // Mappings
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => Card) public cards;
    mapping(uint256 => string) private _tokenURIs; // IPFS hashes
    mapping(bytes32 => bool) public usedSignatures;
    
    // Address authorized to sign mint transactions
    address public signerAddress;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event CardMinted(address indexed to, uint256 indexed tokenId, uint8 cardId, Rarity rarity);
    event CardStatusChanged(uint256 indexed tokenId, bool isActive);
    event SignerUpdated(address indexed newSigner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Custom errors
    error InvalidAddress();
    error InvalidCardId();
    error InvalidSignature();
    error SignatureAlreadyUsed();
    error TokenNotFound();
    error NotAuthorized();
    error NotTokenOwner();
    error InvalidBatchSize();
    error ArrayLengthMismatch();

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotAuthorized();
        _;
    }

    /**
     * @dev Constructor
     * @param _signerAddress Address authorized to sign mint transactions
     */
    constructor(address _signerAddress, address /* _fanatiqueContract */) {
        if (_signerAddress == address(0)) {
            revert InvalidAddress();
        }
        
        owner = msg.sender;
        signerAddress = _signerAddress;
        // _fanatiqueContract parameter kept for compatibility but not used when inherited
    }

    /**
     * @dev Recover signer from signature
     */
    function _recoverSigner(bytes32 messageHash, bytes calldata signature) 
        private 
        pure 
        returns (address) 
    {
        if (signature.length != 65) return address(0);
        
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 0x20))
            v := byte(0, calldataload(add(signature.offset, 0x40)))
        }
        
        if (v < 27) v += 27;
        if (v != 27 && v != 28) return address(0);
        
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    /**
     * @dev Mint a single card with signature validation
     * @param to Address to mint the card to
     * @param cardId Card template ID (1-5)
     * @param rarity Card rarity (0=COMMON, 1=RARE, 2=LEGENDARY)
     * @param ipfsHash IPFS hash for the card metadata
     * @param nonce Unique nonce to prevent replay attacks
     * @param signature Signature from authorized signer
     */
    function mintCard(
        address to,
        uint8 cardId,
        Rarity rarity,
        string calldata ipfsHash,
        uint256 nonce,
        bytes calldata signature
    ) external {
        if (to == address(0)) revert InvalidAddress();
        if (cardId == 0 || cardId > 5) revert InvalidCardId();
        
        // Create message hash for signature verification
        bytes32 messageHash = keccak256(
            abi.encode(to, cardId, rarity, ipfsHash, nonce, address(this))
        );
        
        // Check if signature was already used
        if (usedSignatures[messageHash]) revert SignatureAlreadyUsed();
        
        // Verify signature
        address recoveredSigner = _recoverSigner(messageHash, signature);
        if (recoveredSigner != signerAddress) revert InvalidSignature();
        
        // Mark signature as used
        usedSignatures[messageHash] = true;
        
        // Mint the card
        _mintCard(to, cardId, rarity, ipfsHash);
    }

    /**
     * @dev Batch mint multiple cards
     * @param to Address to mint cards to
     * @param cardIds Array of card template IDs
     * @param rarities Array of card rarities
     * @param ipfsHashes Array of IPFS hashes
     * @param nonce Unique nonce for batch operation
     * @param signature Signature from authorized signer
     */
    function batchMintCards(
        address to,
        uint8[] calldata cardIds,
        Rarity[] calldata rarities,
        string[] calldata ipfsHashes,
        uint256 nonce,
        bytes calldata signature
    ) public {
        if (to == address(0)) revert InvalidAddress();
        
        uint256 length = cardIds.length;
        if (length == 0 || length > 10) revert InvalidBatchSize();
        if (length != rarities.length || length != ipfsHashes.length) {
            revert ArrayLengthMismatch();
        }
        
        // Create message hash for signature verification
        bytes32 messageHash = keccak256(
            abi.encode(to, cardIds, rarities, ipfsHashes, nonce, address(this))
        );
        
        // Check if signature was already used
        if (usedSignatures[messageHash]) revert SignatureAlreadyUsed();
        
        // Verify signature
        address recoveredSigner = _recoverSigner(messageHash, signature);
        if (recoveredSigner != signerAddress) revert InvalidSignature();
        
        // Mark signature as used
        usedSignatures[messageHash] = true;
        
        // Mint each card
        for (uint256 i = 0; i < length;) {
            if (cardIds[i] == 0 || cardIds[i] > 5) revert InvalidCardId();
            _mintCard(to, cardIds[i], rarities[i], ipfsHashes[i]);
            
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @dev Internal batch mint function for memory arrays
     */
    function _batchMintCards(
        address to,
        uint8[] memory cardIds,
        Rarity[] memory rarities,
        string[] memory ipfsHashes
    ) internal {
        uint256 length = cardIds.length;
        
        // Mint each card
        for (uint256 i = 0; i < length;) {
            _mintCard(to, cardIds[i], rarities[i], ipfsHashes[i]);
            
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @dev Internal mint function
     */
    function _mintCard(
        address to,
        uint8 cardId,
        Rarity rarity,
        string memory ipfsHash
    ) private {
        uint256 tokenId = ++_tokenIdCounter;
        
        // Store card data
        cards[tokenId] = Card({
            cardId: cardId,
            rarity: rarity,
            mintedAt: uint32(block.timestamp),
            isActive: true
        });
        
        // Store IPFS hash
        _tokenURIs[tokenId] = ipfsHash;
        
        // Update ownership
        _owners[tokenId] = to;
        unchecked {
            _balances[to]++;
        }
        
        emit Transfer(address(0), to, tokenId);
        emit CardMinted(to, tokenId, cardId, rarity);
    }

    /**
     * @dev Toggle card active status - only token owner
     * @param tokenId Token ID of the card
     */
    function toggleCardStatus(uint256 tokenId) external {
        if (!_exists(tokenId)) revert TokenNotFound();
        if (_ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        
        bool newStatus = !cards[tokenId].isActive;
        cards[tokenId].isActive = newStatus;
        
        emit CardStatusChanged(tokenId, newStatus);
    }

    /**
     * @dev Internal function to get owner of token
     */
    function _ownerOf(uint256 tokenId) internal view returns (address) {
        address tokenOwner = _owners[tokenId];
        if (tokenOwner == address(0)) revert TokenNotFound();
        return tokenOwner;
    }

    /**
     * @dev Get user's cards count by rarity (internal)
     */
    function _countUserCardsByRarity(address user, Rarity rarity) 
        internal 
        view 
        returns (uint256 count) 
    {
        uint256 balance = _balances[user];
        if (balance == 0) return 0;
        
        uint256 maxTokenId = _tokenIdCounter;
        
        for (uint256 tokenId = 1; tokenId <= maxTokenId;) {
            if (_owners[tokenId] == user && cards[tokenId].rarity == rarity) {
                unchecked {
                    ++count;
                }
            }
            unchecked {
                ++tokenId;
            }
        }
    }

    /**
     * @dev Get user's cards count by rarity
     * @param user Address of the user
     * @param rarity Rarity to count
     * @return count Number of cards with specified rarity
     */
    function getUserCardCountByRarity(address user, Rarity rarity) 
        external 
        view 
        returns (uint256 count) 
    {
        return _countUserCardsByRarity(user, rarity);
    }

    /**
     * @dev Get user's cards by rarity - returns token IDs
     * @param user Address of the user
     * @param rarity Rarity to filter by
     * @return tokenIds Array of token IDs matching the rarity
     */
    function getUserCardsByRarity(address user, Rarity rarity) 
        external 
        view 
        returns (uint256[] memory tokenIds) 
    {
        uint256 count = _countUserCardsByRarity(user, rarity);
        if (count == 0) return new uint256[](0);
        
        tokenIds = new uint256[](count);
        uint256 index = 0;
        uint256 maxTokenId = _tokenIdCounter;
        
        for (uint256 tokenId = 1; tokenId <= maxTokenId;) {
            if (_owners[tokenId] == user && cards[tokenId].rarity == rarity) {
                tokenIds[index] = tokenId;
                unchecked {
                    ++index;
                }
                if (index == count) break;
            }
            unchecked {
                ++tokenId;
            }
        }
    }

    /**
     * @dev Get all cards owned by a user
     * @param user Address of the user
     * @return tokenIds Array of token IDs owned by the user
     */
    function getUserCards(address user) external view returns (uint256[] memory tokenIds) {
        uint256 balance = _balances[user];
        if (balance == 0) return new uint256[](0);
        
        tokenIds = new uint256[](balance);
        uint256 index = 0;
        uint256 maxTokenId = _tokenIdCounter;
        
        for (uint256 tokenId = 1; tokenId <= maxTokenId;) {
            if (_owners[tokenId] == user) {
                tokenIds[index] = tokenId;
                unchecked {
                    ++index;
                }
                if (index == balance) break;
            }
            unchecked {
                ++tokenId;
            }
        }
    }

    // Standard ERC721 functions
    function ownerOf(uint256 tokenId) external view returns (address) {
        return _ownerOf(tokenId);
    }

    function balanceOf(address account) external view returns (uint256) {
        if (account == address(0)) revert InvalidAddress();
        return _balances[account];
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        if (!_exists(tokenId)) revert TokenNotFound();
        return _tokenURIs[tokenId];
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }

    // Admin functions
    function updateSignerAddress(address newSigner) external onlyOwner {
        if (newSigner == address(0)) revert InvalidAddress();
        signerAddress = newSigner;
        emit SignerUpdated(newSigner);
    }

    function transferCardsOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    // Interface support
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == 0x01ffc9a7 || // ERC165
               interfaceId == 0x80ac58cd || // ERC721
               interfaceId == 0x5b5e139f;   // ERC721Metadata
    }
} 