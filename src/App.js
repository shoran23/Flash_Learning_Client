import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard.js';
import Header from './components/Header.js';
import TopicView from './components/TopicView.js';

class App extends React.Component {
  state = {
    apiBaseURL: 'http://localhost:',
    apiPort: '3000',
    currentTopic: {},
    topics: [],
    addTopicTitle: "",
    addCardTitle: "",
    addCardDefinition: ""
  }

  /* Topics ****************************************************************/
  getTopics = () => {
    this.setState({topics:[]})
    fetch(this.state.apiBaseURL + this.state.apiPort + '/topics')
        .then(data => data.json(), err => console.log(err))
        .then(parsedData => {
            this.setState({topics: parsedData})
        })
  }

  viewTopic = id => {
    // fetch topic from the database
    fetch(this.state.apiBaseURL + this.state.apiPort + '/topics/' + id)
      .then(data => data.json(), err => console.log(err))
      .then(parsedData => {
        this.setState({currentTopic: parsedData})
      })
  }

  addTopic = () => {
    if(this.state.addTopicTitle.length){
      fetch(this.state.apiBaseURL + this.state.apiPort + '/topics', {
        method: 'POST',
        body: JSON.stringify({
          title: this.state.addTopicTitle
        }),
        headers: {'Content-Type' : 'application/json'}
      }).then(res => res.json())
      .then(resJson => {
        console.log('add topic response: ',resJson)
      })
    }
    setTimeout(this.getTopics,100)
  }

  deleteTopic = id => {
    fetch(this.state.apiBaseURL + this.state.apiPort + '/topics/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type' : 'application/json'
      }})
      setTimeout(this.getTopics,100)
    }

  clearCurrentTopic = () => {
    // clear current topic
    this.setState({currentTopic: {}})
  }
  /*  Forms **************************************************************/
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }
  render () {
    return (
      <div className="App">
        <Header 
          clearCurrentTopic={this.clearCurrentTopic}
        />
        { !this.state.currentTopic.id ?
          <Dashboard
            topics={this.state.topics}
            viewTopic={this.viewTopic}
            deleteTopic={this.deleteTopic}
            addTopic={this.addTopic}
            handleChange={this.handleChange}
            addTopicTitle={this.state.addTopicTitle}
          />
          : <TopicView 
              currentTopic={this.state.currentTopic}
              title={this.state.currentTopic.title}
              cards={this.state.currentTopic.cards}
              apiBaseURL={this.state.apiBaseURL}
              apiPort={this.state.apiPort}
            />
        }
      </div>
    );
  };
  componentDidMount() {
    this.getTopics();
  }
}

export default App;
