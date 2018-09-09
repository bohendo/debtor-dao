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
    constructor() {
        super();
        this.state = {
            title: 'null',
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
      this.setState({ title: event.target.value });
    }

    async componentDidMount() {
        console.log(`crowdlend proposal did mount`)
    }

    render() {
        return (
            <div>
                <h4 style={{ 'marginTop': '20px' , 'textDecoration': 'underline' }}>Propose a new loan:</h4>
                <p>title: {this.state.title}</p>
                <input type='text' onChange={this.handleChange} value={this.state.title} />
                <button onClick={() => {this.props.addCrowdlendToList(this.state.title)}} >Submit</button>
            </div>
        );  
    }   
}

export default ProposeCrowdlend;
