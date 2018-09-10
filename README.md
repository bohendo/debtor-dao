# Motivation

We're inspired by the idea of a debtor DAO. Traditional corporations have the ability to raise funds via debt as well as equity and we'd like to enable this option in the world of DAOs as well.

We'd like to build a DAO that utilizes the crowd-lending feature that was proposed by a recent Dharma Improvement Proposal (DIP-4). Using this feature, we could tap into a crowd of investors who might give loans to our DAOs. In parallel, we could do equity-style fundraising using the native token built-in to systems like DAO Stack.

Let's consider the example of a DAO tasked with building an apartment complex (or any other project that requires large up-front funding). After construction finishes, the DAO might have a collection of non-fungible tokens to sell, each representing one of the newly built apartments. Two categories of outcomes are possible:

    It sells these tokens for as much or more than expected and receives a large payout. This funding goes first into repaying the loans with agreed-upon interest and then the rest is used to make the equity holders fabulously wealthy.

    In a less desirable situation, maybe we have trouble selling the apartments or something goes wrong during construction. We'd sell what we can & liquidate the rest of the DAO-controlled assets to pay off as much of the debt as possible. The equity holders get what's left, if anything.

In this way, we insulate the creditors from as much of the risk as possible. Those without any domain knowledge (eg pension funds who know nothing about building an apartment complex) can still invest their money with some kind of assurance that they'll get paid unless things go terribly wrong. Meanwhile, those with deep domain knowledge (eg construction companies) can have skin-in-the-game and be incentivized to help the project be as successful as possible.

# To deploy:

 - `npm explore @daostack/arc.js -- npm start ganache`
 - `npm explore @daostack/arc.js -- npm start migrateContracts`
 - `rm -rf build`
 - `make`
 - `bash ops/deploy.sh`
 - `npm test`

