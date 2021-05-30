// SPDX-License-Identifier: UNLICNSED
pragma solidity >=0.8.1;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract DOMToken is ERC20, Ownable {

    address public icoAddress;

    constructor(uint256 totalSupply, uint256 amountForTeamMember, address[] memory teamMembers) ERC20("DomToken", "DOM") {
      _mint(address(this), totalSupply);

      for (uint i = 0; i < teamMembers.length; i++) {
        _transfer(address(this), teamMembers[i], amountForTeamMember);
      }
    }

    function initializeICO(address _icoAddress, uint256 _amountOfDomForIco) public {
      require(icoAddress == address(0), "ICO has already been initialized");
      _approve(address(this), _icoAddress, _amountOfDomForIco);
      _transfer(address(this), _icoAddress, _amountOfDomForIco);
      icoAddress = _icoAddress;
    }

    /*function _transfer(address sender, address recipient, uint256 amount) internal override {
        require(block.timestamp > 1638965700000 || msg.sender == owner(), "This token only allows transfers after the ICO finishes.");
        super._transfer(sender, recipient, amount);
    }*/


}
