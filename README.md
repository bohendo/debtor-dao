# Work done so far

 - Copy daostack hacker kit's starter template
 - Copy dharma loans from github.com/dharmaprotocol/charta into contracts/dharma
 - Copy alchemy frontend from github.com/daostack/alchemy into src/

**TODO**:
 - Get all this copy/pasted code running w/out error
 - build a crowdlending scheme like [here](https://github.com/daostack/DAOstack-Hackers-Kit/blob/master/peepeth-dao-example/contracts/PeepScheme.sol)
 - write a happy-path test
 - update the alchemy frontend to allow proposing deb fundraisers

## User Story
 - someone buys equity
 - equity holder stakes equity to get rep
 - rep holder proposes crowdfunding via debt with parameters x, y, z..
 - rep holders vote on & pass crowdfunding proposal
 - avatar activates crowdlending scheme:
   - calls fillDebtOrder to create empty debt token
   - debt token transferred to crowdlending token registry
   - crowdfunding tokens become available for sale
 - creditor buys crowdfunding tokens to effectively loan money to the DAO
 - rep holders vote on how the loaned money is spent, hopefully in a way to generate profit
 - DAO brings in profit
 - global constraint prevents these profits from going to dividends while the DAO has outstanding debt
 - after loans are repaid, profit gets paid to equity holders as dividends

## Actors
- Tokens: native to the DAO
- Avatar: represents account of DAO and this address would hold its assets
- Reputation: decision power in DAO and can be granted/taken away by DAO
- Creditor: address from which money will be lent
- Equity holder: address which may purchase equity tokens
- Reputation Holder

## Actions

**Equity Holder**:
 - buy equity token
 - lock equity token to earn rep

**Rep holder**
 - propose crowdfunded debt parameters:
   - how much principal
   - principal token
   - terms contract
   - terms contract parameters
   - interest rate
   - debt order expiration
 - vote on proposals for spending funds

**DAO Schemes**
 - activate crowdfunded debt order
   - fillDebtOrder w DAO avatar as both debtor & creditor.
   - mint crowdLendingTokens equal to how much principal is available.

**Constraints**
 - equity holders don't get paid until all debt has been repaid
 - maximum number of equity token

# Questions
 - Can a scheme execute multiple transactions?
 - Which contracts are deployed for Genesis Alpha? Are all the arc contracts already deployed?


---

# DAOstack Starter Template

This is a basic template you can use for kickstarting your project using the DAOstack platform.
Here you can find the basic structue for using both Arc and Arc.js to build your project.

# How to get started:

First, please change the `package.json` file to fit your project.
You can then go ahead and edit the template to fit your needs.

## Project Structure:

In this template, we use: `npm`, `truffle` and `webpack`, as well as DAOstack Arc and Arc.js.
The structure is basically as follows:

- `contracts` - Your custom smart contracts should be located under here. You can use any Arc contract simply by importing it. This is an example import `import "@daostack/arc/contracts/universalSchemes/UniversalScheme.sol";`.
- `test` - Your JS test files should be located under this folder. You can add any standard truffle tests under this folder.
- `migrations` - This is a truffle migration scripts folder. You can write Truffle migration script for deploying your DAO or smart contracts and place the script under that folder. We already created a file for you there wiith some explanation on how to use it with Arc.
- `src` - This folder is used for JavaScript files which are written in NodeJS. This later use `webpack` to compile them into client side JS files. You can find there a starting file which you can use for your project. If you're willing to add or change files there please review the `webpack.config.js` file and modify it to work with your changes.

- `dist` - Your Dapp front-end files should be placed under this folder. You can see there we already creaated a basic HTML page imorting JQuery and the compiled js file from `src` (named `main.js`).

# Running your project.

Install node version manager

For MacOS

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
nvm --version
```

If you are having troubles with the nvm installation, look no further than here: https://github.com/creationix/nvm/blob/master/README.md#install-script

Install proper node and npm versions

```
nvm install 9.5
npm install -g npm@5.10
node --version
npm --version
```

Whenever you open a new terminal, execute

```
nvm use 9.5
```

To run your project on a local testnet:

Enter the project folder from the terminal/cmd, then type:

```
npm install
npm run chain
```

Then, open a different terminal window (but still in your project folder) and type:

```
npm test
```

You should see two passing tests
