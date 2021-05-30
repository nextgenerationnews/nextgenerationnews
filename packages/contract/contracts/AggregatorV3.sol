// SPDX-License-Identifier: MIT
pragma solidity >=0.8.1;
// ETH TO USD mock, an ETH is 1814,56 USD

contract AggregatorV3 {

  function decimals() external view returns (uint8) {
    return 8;
  }

  function description() external view returns (string memory) {
    return 'ETH / USD';
  }

  function version() external view returns (uint256) {
    return 3;
  }

  // getRoundData and latestRoundData should both raise "No data present"
  // if they do not have data to report, instead of returning unset values
  // which could be misinterpreted as actual reported values.
  function getRoundData(uint80 _roundId)
    external
    view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    ) {
      return (
        55340232221128674146,
        300072028816,
        1613256925,
        1613256935,
        55340232221128674146
      );
    }

  function latestRoundData()
    external
    view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    ) {
      return (
        55340232221128674146,
        300072028816,
        1613256925,
        1613256935,
        55340232221128674146
      );
    }

}
