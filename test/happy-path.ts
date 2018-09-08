import * as Web3 from "web3";
import * as chai from "chai";

import { DebtKernelContract } from "../types/generated/debt_kernel";
import { DebtRegistryContract } from "../types/generated/debt_registry";
import { DebtTokenContract } from "../types/generated/debt_token";
import { RepaymentRouterContract } from "../types/generated/repayment_router";
import { SimpleInterestTermsContractContract } from "../types/generated/simple_interest_terms_contract";
import { TokenRegistryContract } from "../types/generated/token_registry";
import { TokenTransferProxyContract } from "../types/generated/token_transfer_proxy";

const expect = chai.expect;

/*
const debtKernelContract = artifacts.require("DebtKernel");
const debtDebtRegistryContract = artifacts.require("DebtRegistry");
const debtDebtTokenContract = artifacts.require("DebtToken");
const debtRepaymentRouterContract = artifacts.require("RepaymentRouter");
const debtTermsContractContract = artifacts.require("TermsContract");
const debtTokenRegistryContract = artifacts.require("TokenRegistry");
const debtTokenTransferProxyContract = artifacts.require("TokenTransferProxy");
*/

contract("Debtor DAO Integration", async (ACCOUNTS) => {
    let kernel: DebtKernelContract;

    before(async () => {
        const CONTRACT_OWNER = ACCOUNTS[0];
        const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4712388 };
        console.log(`web3: ${typeof web3}, deployed: ${typeof DebtKernelContract.deployed}, tx: ${TX_DEFAULTS}`);
        kernel = await DebtKernelContract.deployed(web3, TX_DEFAULTS);
    });

    it("should be deployed", async () => {
        expect(kernel.address).to.exist;
    })

    describe("Initialization & Upgrades", async () => {
        it("should be deployed", async () => {
            expect(kernel.address).to.exist;
        })
    })

})
