import { DOM_INITIAL_SUPPLY, DOM_INITIAL_PERCENTAGE_FOR_CREATORS } from './project-parameters';

module.exports = function (deployer: Truffle.Deployer, network: string, accounts: string[]) {
  const DomToken = artifacts.require('DOMToken');
  const initialSupply = parseInt(DOM_INITIAL_SUPPLY.replace(/[_ ]/gs, ''), 10);
  const supplyPercentageForTeamMembers = parseFloat(DOM_INITIAL_PERCENTAGE_FOR_CREATORS.replace(/[ %]/gs, '')) / 100;

  const teamWallets = [] as string[];

  if (['development', 'test'].includes(network)) {
    teamWallets.push(...accounts);
  } else {
    teamWallets.push(...(process.env.TEAM_MEMBERS_WALLETS || '').split(','));
  }

  const supplyForTeamMembers = (initialSupply * supplyPercentageForTeamMembers) / Math.max(1, teamWallets.length);

  deployer.deploy(DomToken, initialSupply, supplyForTeamMembers, teamWallets);
} as Truffle.Migration;
