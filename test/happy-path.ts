import * as Web3 from "web3";
import * as chai from "chai";

import { DebtKernelContract } from "../types/generated/debt_kernel";
import { CrowdfundingTokenRegistryContract } from "../types/generated/crowdfunding_token_registry";

const expect = chai.expect;

contract("Debtor DAO Integration", async (ACCOUNTS) => {
    let kernel: DebtKernelContract;
    let crowdfundingTokenRegistry: CrowdfundingTokenRegistryContract;

    before(async () => {
        const CONTRACT_OWNER = ACCOUNTS[0];
        const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4712388 };
        kernel = await DebtKernelContract.deployed(web3, TX_DEFAULTS);
        console.log('deployed: ', typeof CrowdfundingTokenRegistryContract.deployed);
        crowdfundingTokenRegistry = await CrowdfundingTokenRegistryContract.deployed(web3, TX_DEFAULTS);
        console.log('token: ', typeof crowdfundingTokenRegistry);
    });

    describe("Initialization & Upgrades", async () => {
        it("should deploy dharma debt kernel", async () => {
            expect(kernel.address).to.exist;
        })
        it("should deploy crowdfundingTokenRegistry", async () => {
            expect(crowdfundingTokenRegistry.address).to.exist;
        })
    })

})
