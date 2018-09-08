pragma solidity ^0.4.24;

import "@daostack/arc/contracts/universalSchemes/UniversalScheme.sol";
import "@daostack/arc/contracts/universalSchemes/ExecutableInterface.sol";
import "@daostack/arc/contracts/VotingMachines/IntVoteInterface.sol";
import "@daostack/arc/contracts/controller/ControllerInterface.sol";
import "./DebtorDaoInterface.sol";

contract CrowdLendScheme is UniversalScheme {
    address public debtorDaoContract;

    constructor(address _debtorDaoContract) public {
        debtorDaoContract = _debtorDaoContract;
    }
}
