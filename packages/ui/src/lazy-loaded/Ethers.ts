import { Contract } from '@ethersproject/contracts';
import { BigNumber, FixedNumber } from '@ethersproject/bignumber';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { parseEther, formatEther } from '@ethersproject/units';
import { LoadMessage } from './LoadMessages';

window.Ethers = {
  Contract,
  BigNumber,
  JsonRpcProvider,
  Web3Provider,
  parseEther,
  formatEther,
  FixedNumber,
};

window.postMessage(LoadMessage.ETHERS, window.location.toString());
