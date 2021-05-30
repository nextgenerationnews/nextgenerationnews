module.exports = function (deployer: Truffle.Deployer, network: string) {
  const AggregatorV3 = artifacts.require('AggregatorV3');
  if (['development', 'test'].includes(network)) {
    deployer.deploy(AggregatorV3);
  }
} as Truffle.Migration;
