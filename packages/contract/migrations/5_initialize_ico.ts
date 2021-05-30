import { DOM_INITIAL_PERCENTAGE_FOR_ICO, DOM_INITIAL_SUPPLY } from './project-parameters';

module.exports = async function (_deployer: Truffle.Deployer) {
  const DomTokenPurchase = artifacts.require('DomTokenPurchase');
  const DomToken = artifacts.require('DOMToken');

  const totalSupply = parseInt(DOM_INITIAL_SUPPLY.replace(/[_ ]/gs, ''), 10);
  const percentageAvailableForICO = parseFloat(DOM_INITIAL_PERCENTAGE_FOR_ICO.replace(/[% ]/gs, '')) / 100;
  const amountForICO = parseInt((totalSupply * percentageAvailableForICO).toString(), 10);

  (await DomToken.at(DomToken.address)).initializeICO(DomTokenPurchase.address, amountForICO);
} as Truffle.Migration;
