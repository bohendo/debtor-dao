pragma solidity ^0.4.24;

interface DebtTokenInterface {
    function safeTransferFrom(address _from, address _to, uint _tokenId) external;

    function generateTokens(address _owner, uint _amount) external returns(bool);
}
