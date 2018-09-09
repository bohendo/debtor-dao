import React from 'react'

class Proposals extends React.Component {

    async componentDidMount() {
    }

    render() {

        const listOfProposals = [];
        for (let p = 0; p <  this.props.crowdlendProposals.length; p++) {
            let proposal = this.props.crowdlendProposals[p];
            listOfProposals.push(
                <div key={p.toString()}>
                    <p>
                    Proposal to borrow {proposal.principalAmount} {proposal.principalToken} at an interest rate of {proposal.interestRate}
                    <span
                      onClick={() => {this.props.voteYes(proposal)}}
                      style={{ 'marginLeft': '10em' }}
                    >
                      Vote Yes
                    </span>
                    <span
                      onClick={() => {this.props.voteNo(proposal)}}
                      style={{ 'marginLeft': '10em' }}
                    >
                      Vote No
                    </span>
                    </p>
                </div>
            )
        }

        return (
            <div>
                <h4 style={{ 'marginTop': '20px' , 'textDecoration': 'underline' }}>All Proposals:</h4>
                {listOfProposals}
            </div>
        );  
    }   
}

export default Proposals;
