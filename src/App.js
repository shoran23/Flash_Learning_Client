import React from 'react';
import './App.css';
// import {
//   BrowswerRouter as Router,
//   Switch,
//   Route,
//   Link
// } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';
import Header from './components/Header.js';
import TopicView from './components/TopicView.js';
import QuizView from './components/QuizView.js'

class App extends React.Component {
  state = {
    apiBaseURL: 'https://radiant-island-78718.herokuapp.com/',
    apiPort: '8080',
    currentTopic: {},
    topics: [],
    topicTitle: "",
    addCardTitle: "",
    addCardDefinition: "",
    topicEditId: 0,
    quizEnabled: false
  }

  /* Topics ****************************************************************/
  getTopics = () => {
    fetch(this.state.apiBaseURL + '/topics')
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
    if(this.state.topicTitle.length){
      fetch(this.state.apiBaseURL + this.state.apiPort + '/topics', {
        method: 'POST',
        body: JSON.stringify({
          title: this.state.topicTitle
        }),
        headers: {'Content-Type' : 'application/json'}
      }).then(res => res.json())
      .then(resJson => {
        console.log('add topic response: ',resJson)
      })
    }
    setTimeout(this.getTopics,100)
    // clear topic state
    this.setState({topicTitle: ""})
  }

  editTopic = id => {
    fetch(this.state.apiBaseURL + this.state.apiPort + '/topics/' + id, {
      method: 'PUT',
      body: JSON.stringify({
        title: this.state.topicTitle
      }),
      headers: {'Content-Type' : 'application/json'}
    })
    .then(res => res.json())
    .then(resJson => {
      console.log('edit topic response: ',resJson)
    })
    setTimeout(this.getTopics,100)
    // clear topic state
    this.setState({topicTitle: ""})
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
  /*  Quiz **************************************************************/
  handleQuiz = state => {
    this.setState({quizEnabled: state})
  }

  render () {

    let topicView;

    if(this.state.quizEnabled === false){
      topicView = <TopicView 
        currentTopic={this.state.currentTopic}
        title={this.state.currentTopic.title}
        cards={this.state.currentTopic.cards}
        apiBaseURL={this.state.apiBaseURL}
        apiPort={this.state.apiPort}
        handleQuiz={this.handleQuiz}
      />
    } else {
      topicView = <QuizView 
        topic={this.state.currentTopic}
        handleQuiz={this.handleQuiz}
      />
    }

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
            editTopic={this.editTopic}
            handleChange={this.handleChange}
            topicTitle={this.state.topicTitle}
            currentTopic={this.state.currentTopic}
          />
        :
          topicView
        }
      </div>
    );
  };
  componentDidMount() {
    this.getTopics();
  }
}

export default App;
