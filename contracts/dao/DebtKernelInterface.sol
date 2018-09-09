pragma solidity ^0.4.24;

interface DebtKernelInterface {
    function fillDebtOrder(
        address creditor,
        address[6] orderAddresses,
        uint[8] orderValues,
        bytes32[1] orderBytes32,
        uint8[3] signaturesV,
        bytes32[3] signaturesR,
        bytes32[3] signaturesS
    ) external returns(bytes32);

}
