pragma solidity ^0.4.24;

interface CrowdfundingTokenRegistryInterface {
    function crowdfundingTokens(uint _tokenId) external returns(address);
}
