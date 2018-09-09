pragma solidity ^0.4.24;

import "@daostack/arc/contracts/universalSchemes/UniversalScheme.sol";
import "@daostack/arc/contracts/universalSchemes/ExecutableInterface.sol";
import "@daostack/arc/contracts/VotingMachines/IntVoteInterface.sol";
import "@daostack/arc/contracts/controller/ControllerInterface.sol";
import "./DebtKernelInterface.sol";

contract RepaymentScheme is UniversalScheme, ExecutableInterface {
    event NewRepaymentProposed(
        address indexed _proposer,
        bytes32 indexed _proposalId,
        uint reputationChange
    );

    event ProposalExecuted(
        bytes32 _proposalId,
        int _param
    );

    struct RepaymentProposal {
        bytes32 termsParameters;
        address termsContract;
        address proposer;
        address principalToken;
        uint principalAmount;
        uint reputationChange;
    }

    struct Parameters {
        bytes32 voteApproveParams;
        IntVoteInterface intVote;
    }

    address DebtKernel;
    address RepaymentRouter;
    address DebtToken;
    address CrowdfundingTokenRegistry;

    address NULL_ADDRESS = address(0);
    address public debtorDaoContract;
    Parameters public controllerParam;
    mapping(bytes32=>RepaymentProposal) public organizationsProposals;

    constructor(address _debtKernel, address _repaymentRouter, address _debtToken, address _crowdfundingTokenRegistry) public {
        DebtKernel = _debtKernel;
        RepaymentRouter = _repaymentRouter;
        DebtToken = _debtToken;
        CrowdfundingTokenRegistry = _crowdfundingTokenRegistry;
    }

    function setParameters(
        bytes32 voteApproveParams,
        IntVoteInterface _intVote
    )
    public
    {
        controllerParam.voteApproveParams = voteApproveParams;
        controllerParam.intVote = _intVote;
    }

    function proposeRepayment(
        address avatar,
        bytes32 termsParameters,
        address termsContract,
        address principalToken,
        uint principalAmount,
        uint reputationChange
    )
    public
    returns(bytes32)
    {
        bytes32 proposalId = controllerParam.intVote.propose(
           3,
           controllerParam.voteApproveParams,
           avatar,
           ExecutableInterface(this),
           msg.sender
        );

        RepaymentProposal memory proposal = RepaymentProposal({
            termsParameters: termsParameters,
            termsContract: termsContract,
            proposer: msg.sender,
            principalToken: principalToken,
            principalAmount: principalAmount,
            reputationChange: reputationChange
        });
        organizationsProposals[proposalId] = proposal;
        emit NewRepaymentProposed(msg.sender, proposalId, reputationChange);
    }

    function execute(bytes32 proposalId, address avatar, int param)
    public
    returns(bool)
    {
        require(controllerParam.intVote == msg.sender, "Only the voting machine can execute proposal");

        // Check if vote was successful:
        if (param == 1) {
            RepaymentProposal memory proposal = organizationsProposals[proposalId];

            ControllerInterface controller = ControllerInterface(Avatar(avatar).owner());

            // Sends a call to the DebtKernel contract to request Dharma debt.
            bytes32 DebtTokenId = controller.genericCall(
                DebtKernel,
                abi.encodeWithSelector(
                    DebtKernelInterface(DebtKernel).fillDebtOrder.selector,
                    avatar,
                    [
                        RepaymentRouter,
                        avatar,
                        NULL_ADDRESS,
                        proposal.termsContract,
                        proposal.principalToken,
                        NULL_ADDRESS
                    ],
                    [
                        uint8(0),
                        uint8(0),
                        uint8(blockhash(block.number)),
                        uint8(proposal.principalAmount),
                        uint8(0),
                        uint8(0),
                        uint8(0),
                        uint8(0),
                        uint8(now+1)
                    ],
                    proposal.termsParameters,
                    [uint8(0), uint8(0), uint8(0)],
                    [bytes32(0), bytes32(0), bytes32(0)],
                    [bytes32(0), bytes32(0), bytes32(0)]
                ),
                avatar
            );

            // Sends DebtToken to CrowdFundingRegistry
            controller.genericCall(
                DebtToken,
                abi.encodeWithSelector(
                    DebtKernelInterface(DebtToken).safeTransferFrom.selector,
                    avatar,
                    CrowdfundingTokenRegistry,
                    uint256(DebtTokenId)
                ),
                avatar
            );

            // Mints reputation for the proposer
            require(controller.mintReputation(uint(proposal.reputationChange), proposal.proposer, avatar),
            "Failed to mint reputation to proposer"
            );
        } else {
            delete organizationsProposals[proposalId];
        }

        emit ProposalExecuted(proposalId, param);
        return true;
    }
}
