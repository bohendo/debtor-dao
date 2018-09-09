pragma solidity ^0.4.24;

import "@daostack/arc/contracts/universalSchemes/UniversalScheme.sol";
import "@daostack/arc/contracts/universalSchemes/ExecutableInterface.sol";
import "@daostack/arc/contracts/VotingMachines/IntVoteInterface.sol";
import "@daostack/arc/contracts/controller/ControllerInterface.sol";

interface ContractRegistry {
    function collateralizer() returns(address);
    function debtKernel() returns(address);
    function debtRegistry() returns(address);
    function debtToken() returns(address);
    function repaymentRouter() returns(address);
    function tokenRegistry() returns(address);
    function tokenTransferProxy() returns(address);
}

interface DebtToken {
    function safeTransferFrom(address _from, address _to, uint _tokenId) external;
    function generateTokens(address _owner, uint _amount) external returns(bool);
}

interface CrowdfundingToken {
    function generateTokens(address _owner, uint _amount) external returns(bool);
}

interface DebtKernel {
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

interface CrowdfundingTokenRegistry {
    function crowdfundingTokens(uint _tokenId) external returns(address);
    function anotherFunction(address foo) external returns(bytes32);
}

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

    ContractRegistry public contractRegistry;
    CrowdfundingTokenRegistry public crowdfundingTokenRegistry;
    address NULL_ADDRESS = address(0);

    bytes32 DebtTokenId;

    Parameters public controllerParam;
    mapping(bytes32=>RepaymentProposal) public organizationsProposals;

    constructor(address _contractRegistry, address _crowdfundingTokenRegistry) public {
        contractRegistry = ContractRegistry(_contractRegistry);
        crowdfundingTokenRegistry = CrowdfundingTokenRegistry(_crowdfundingTokenRegistry);
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
            address debtKernel = contractRegistry.debtKernel();
            DebtTokenId = controller.genericCall(
                debtKernel,
                abi.encodeWithSelector(
                    DebtKernel(debtKernel).fillDebtOrder.selector,
                    avatar,
                    [
                        address(contractRegistry.repaymentRouter()),
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
            address debtToken = contractRegistry.debtToken();
            controller.genericCall(
                debtToken,
                abi.encodeWithSelector(
                    DebtToken(debtToken).safeTransferFrom.selector,
                    avatar,
                    address(crowdfundingTokenRegistry),
                    uint256(DebtTokenId)
                ),
                avatar
            );

            address crowdfundingToken = crowdfundingTokenRegistry.crowdfundingTokens(uint(DebtTokenId));

            // Mint Crowfunding Token for sale
            controller.genericCall(
                crowdfundingToken,
                abi.encodeWithSelector(
                    CrowdfundingToken(crowdfundingToken).generateTokens.selector,
                    avatar,
                    proposal.principalAmount
                ),
                avatar
            );

            // Mints reputation for the proposer of the Peep.
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
