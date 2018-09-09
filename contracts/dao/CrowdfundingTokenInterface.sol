pragma solidity ^0.4.24;

interface CrowdfundingTokenInterface {
    function generateTokens(address _owner, uint _amount) external returns(bool);
}
