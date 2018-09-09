module.exports = (deployer, network, accounts) => {
    const ContractRegistry = artifacts.require("ContractRegistry");
    const SimpleInterestTermsContract = artifacts.require("SimpleInterestTermsContract");
    const CollateralizedSimpleInterestTermsContract = artifacts.require(
        "CollateralizedSimpleInterestTermsContract",
    );

    deployer.deploy(SimpleInterestTermsContract, ContractRegistry.address);
    deployer.deploy(CollateralizedSimpleInterestTermsContract, ContractRegistry.address);

};
