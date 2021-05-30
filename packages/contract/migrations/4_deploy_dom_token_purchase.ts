import { DOM_ICO_MINIMUM_PURCHASE, DOM_ICO_TOKEN_PRICE_IN_WEI } from './project-parameters';

module.exports = async function (deployer: Truffle.Deployer) {
  const DomTokenPurchase = artifacts.require('DomTokenPurchase');
  const DomToken = artifacts.require('DOMToken');

  const tokenPrice = parseInt(DOM_ICO_TOKEN_PRICE_IN_WEI.replace(/[_ ]/gs, ''), 10);
  const minPurchase = parseInt(DOM_ICO_MINIMUM_PURCHASE.replace(/[_ ]/gs, ''), 10);

  deployer.deploy(DomTokenPurchase, DomToken.address, tokenPrice, minPurchase);
} as Truffle.Migration;
