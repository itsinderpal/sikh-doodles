// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SikhDoodles is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string public baseURI;
  string public baseExtension = ".json";
  uint256 public cost = 0.002 ether;
  uint256 public maxSupply = 10000;
  uint256 public maxMintAmount = 10;
  bool public paused = false;
  mapping(address => bool) public whitelisted;
  string _initBaseURI = "ipfs://QmWGp8U38kTZXEg9hcd3sQhMR5BM5TVmo7rPb9M8wknJRF";

  constructor() ERC721("Sikh Doodles", "SKHD") payable {
    setBaseURI(_initBaseURI);
    for (uint256 i = 1; i <= 50; i++) {
      _safeMint(msg.sender, i);
    }
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  // public
  function mint(address _to, uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    require(!paused, "Contract is paused right now!");
    require(_mintAmount > 0, "Mint amount is less than 0");
    require(_mintAmount <= maxMintAmount, "Mint amount is greater than the max mint amount of a wallet.");
    require(supply + _mintAmount <= maxSupply, "Not enough tokens in the contract.");
    require(msg.value >= cost, "Not enough ether sent!");

    if (msg.sender != owner()) {
        if(whitelisted[msg.sender] != true) {
          require(msg.value >= cost * _mintAmount);
        }
    }

    for (uint256 i = 1; i <= _mintAmount; i++) {
      _safeMint(_to, supply + i);
    }
  }

  function mintById(uint256 _mintId) public payable {
    require(!paused, "Contract is paused right now!");
    require(
      !_exists(_mintId),
      "Token already exists"
    );
    require(_mintId > 0, "Mint Id cannot be 0");
    require(_mintId <= maxSupply, "Mint Id cannot be greater than Max supply");
    require(msg.value >= cost, "Not enough ether sent!");

    _safeMint(msg.sender, _mintId);
  }

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, "/", tokenId.toString(), baseExtension))
        : "";
  }

  //only owner
  function setCost(uint256 _newCost) public onlyOwner() {
    cost = _newCost;
  }

  function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
    maxMintAmount = _newmaxMintAmount;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }
 
 function whitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = true;
  }
 
  function removeWhitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = false;
  }

  function withdraw() public payable onlyOwner {
    // Do not remove this otherwise you will not be able to withdraw the funds.
    // =============================================================================
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
    // =============================================================================
  }
}