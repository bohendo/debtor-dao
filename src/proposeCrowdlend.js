import React from 'react'
import ReactDOM from 'react-dom'

import {
  InitializeArcJs,
  LoggingService,
  LogLevel,
  DAO,
  ConfigService,
  AccountService,
  WrapperService,
  BinaryVoteResult
} from "@daostack/arc.js";

class ProposeCrowdlend extends React.Component {

    async componentDidMount() {
        console.log(`crowdlend proposal did mount`)
    }

    render() {
        return (
            <div>
                <h4 style={{ 'marginTop': '20px' , 'textDecoration': 'underline' }}>Propose a new loan:</h4>
                <input type='text' />
            </div>
        );  
    }   
}

export default ProposeCrowdlend;
