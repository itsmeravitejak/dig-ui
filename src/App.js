import React from 'react';
// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';


class App extends React.Component {
  constructor(props) {
      super(props);
    console.log(this.props);
        this.state={domain:"",query_type:"ANY",status:"",message:""}
        this.handleDomainChange=this.handleDomainChange.bind(this);
        this.handleQueryClick=this.handleQueryClick.bind(this);
    }
    handleDomainChange(event){
        this.setState({domain: event.target.value})

    }
    handleQueryClick(event){
        this.setState({query_type:event.target.value,status:"Loading"})
        
        
        let url="https://dns-resolver-786.herokuapp.com/";
        let postOptions={ method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached    
                headers: {
                'Content-Type': 'application/json'    
                },        
            body: JSON.stringify([this.state.domain,event.target.value]) };
        fetch(url,postOptions)
        .then(res=>res.json())
        .then(json=>this.setState({status:"Done",message:json}))
    }
    getMessage(){
        if(this.state.status==="Loading")
            return "Loading..."
        else if(this.state.status==="Done")
            {
                let theads=[];
                theads.push(<tr key="0"><td>Domain</td><td>Type</td><td>TTL</td><td>value</td></tr>);
                let trs=[];
                
                let answers=this.state.message.answer;
                console.log(this.state.message);
                if(!answers){
                    trs.push(<tr key="1"><td colSpan="4">No Answer</td></tr>)
                }
                else
                for (let index = 0; index < answers.length; index++) {
                    const answer=answers[index];
                    trs.push(<tr key={index+1}><td>{answer['domain']}</td><td>{answer['type']}</td><td>{answer['ttl']}</td><td>{answer['value']}</td></tr>);                    
                }
                // console.log(this.state.message);
                return <table className="table table-striped table-bordered"><thead className="thead-dark">{theads}</thead><tbody>{trs}</tbody></table>;
            }
        
    }
  render() {
  const query_types=["A","AAAA","ANY","CNAME","NS","MX"].map((each_item)=>
    <label className="btn btn-secondary" key={each_item}>
        <input type="radio" name="query_type" value={each_item} onClick={this.handleQueryClick}/> {each_item}
    </label>
  )

  return (
    <div className="container">
        <div className="jumbotron">
            <h1 className="display-4">Online Dig</h1>
            <p className="lead">This is a online dig tool</p>
            <input type="text" placeholder="domain.com" value={this.state.domain} onChange={this.handleDomainChange}/>
            
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                {query_types}
            </div>
            
            
            <hr className="my-4" />
            <div>
                {this.getMessage()}
            </div>
        </div>
    </div>
  );
}
}

export default App;
