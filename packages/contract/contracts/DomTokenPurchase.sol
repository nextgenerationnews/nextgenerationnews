// SPDX-License-Identifier: UNLICNSED
pragma solidity >=0.8.1;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract DomTokenPurchase {

    ERC20 public domToken;
    uint256 public domTokenPriceinWei;
    uint256 public minimumDomBuy;
    address public contractOwner;

    constructor(ERC20 _domTokenAddress, uint256 _domTokenPrice, uint256 _minimumDomBuy) {
       contractOwner = msg.sender;
       domToken = ERC20(_domTokenAddress);
       domTokenPriceinWei = _domTokenPrice;
       minimumDomBuy = _minimumDomBuy;
    }

    function purchaseTokens() public payable {
        require(msg.value >= 0, "You should send some value to this function.");
        uint256 domQty = msg.value / domTokenPriceinWei;
        require(domQty >= minimumDomBuy, "Please respect the minimum amount to buy.");
        domToken.approve(address(this), domQty);
        domToken.transferFrom(address(this), msg.sender, domQty);
    }

    function burnTokens(uint256 amount) public {
      // se o timestamp de fim de ICO passou, queima o que sobrou
      require(msg.sender == contractOwner, "You are not the owner of this contract.");
      domToken.transferFrom(address(this), msg.sender, amount);
    }

    function withDrawForContractOwner(address payable _sender) public {
        require(msg.sender == contractOwner, "You are not the owner of this contract.");
        require(_sender == contractOwner, "You are not the owner of this contract.");
        _sender.transfer(address(this).balance);
    }
}
