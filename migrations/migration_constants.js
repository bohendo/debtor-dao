const OWNER_ONE = "0x5d497982326f641e0b374585ff7c1c1be9878560";
const OWNER_TWO = "0x8f8c5ebde485dfcb64d8e6d1dea833b2d43fb9de";
const OWNER_THREE = "0xb41411e8cfae259a6494ecdc81833b627f051be4";
const OWNER_FOUR = "0xfefdde6a490cd4095de204b6fe31ba1607b19e3f";
const OWNER_FIVE = "0xa32d732ab0096dbf837f3e5d358ac5b597dcbf73";

const SIGNATORIES = [OWNER_ONE, OWNER_TWO, OWNER_THREE, OWNER_FOUR, OWNER_FIVE];
const THRESHOLD = 1 / 2; // 50%
const TIMELOCK_IN_SECONDS = 60 * 60 * 24 * 7; // 7 Days
const LIVE_NETWORK_ID = "live";
const KOVAN_NETWORK_ID = "kovan";
const DUMMY_TOKEN_SUPPLY = 1000 * 10 ** 18;
const DUMMY_TOKEN_DECIMALS = 18;
const NUM_INITIAL_BALANCE_HOLDERS = 10;

/**
 * The secure address that is allowed to set DebtToken URIs.
 *
 * @type {string}
 */
const TOKEN_URI_OPERATOR = "0x5d497982326f641e0b374585ff7c1c1be9878560";

/**
 * A list of the contract names, representing the instances
 * that will be transferred to the multi-sig wallet.
 *
 * @type {string[]}
 */
const NAMES_OF_CONTRACTS_OWNED_BY_MULTISIG = [
    "DebtRegistry",
    "DebtToken",
    "DebtKernel",
    "TokenTransferProxy",
    "RepaymentRouter",
    "Collateralizer",
    "TokenRegistry",
    "ContractRegistry",
];

/**
 * Given that the Canonical WETH has an instance deployed onto Kovan
 * and there are numerous tools that can be used to interact with WETH,
 * even in a testnet context, we store its address so we can use it
 * in our migrations.
 *
 * @type {String}
 */
const KOVAN_WETH_ADDRESS = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";

/**
 * A list of the top 50 tokens by market cap, according to etherscan.io/tokens.
 * NOTE: These are not in strict order of market cap.
 *
 * Retrieved on April 12, 2018.
 */
const TOKEN_LIST = [
    {
        address: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
        name: "Dai Stablecoin",
        symbol: "DAI",
        decimals: 18,
    },
    {
        address: "0xe94327d07fc17907b4db788e5adf2ed424addff6",
        name: "Augur REP",
        symbol: "REP",
        decimals: 18,
    },
    {
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        name: "Canonical Wrapped Ether",
        symbol: "WETH",
        decimals: 18,
    },
];

module.exports = {
    SIGNATORIES,
    THRESHOLD,
    TIMELOCK_IN_SECONDS,
    LIVE_NETWORK_ID,
    KOVAN_NETWORK_ID,
    DUMMY_TOKEN_SUPPLY,
    DUMMY_TOKEN_DECIMALS,
    KOVAN_WETH_ADDRESS,
    TOKEN_LIST,
    NAMES_OF_CONTRACTS_OWNED_BY_MULTISIG,
    NUM_INITIAL_BALANCE_HOLDERS,
    TOKEN_URI_OPERATOR,
};
