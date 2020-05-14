import React from  'react'

class Topic extends React.Component {
    getColor = index => {
        let color;
        if(index < 4){
            if(index % 2 === 0) {
                color = '255,128,0'
            } else {
                color = '0,204,204'
            }
        } else {
            if(index % 2 === 0) {
                color = '0,204,204'
            } else {
                color = '255,128,0'
            }
        }
        return `rgba(${color},0.70)`
    }

    render () {
        return (
            <div style={{border: `10px solid ${this.getColor(this.props.index)}`}} className='topic'>
                <div className='topic-title' >{this.props.title}</div>
                <div className='topic-body'>
                    <button className='topic-view' onClick={() => this.props.viewTopic(this.props.id)}>View</button>
                    <button className='topic-edit' onClick={() => this.props.handleTopicForm('edit',this.props.id)}>Edit</button>
                    <button className='topic-delete' onClick={() => this.props.deleteTopic(this.props.id)} >Delete</button>
                </div>
            </div>
        )
    }
}

class TopicForm extends React.Component {
    render () {
        return (
            <div className='topic-form-background'>
                <div style={{border: `5x solid rgba(0,255,128)`}} className='topic-form'>
                    <form>
                        { !this.props.topicFormEdit ?
                            <h3>New Topic</h3>
                        :
                            <h3>Edit Topic</h3>
                        }
                        <input 
                            type="text"
                            name="topicTitle"
                            id="topicTitle"
                            onChange={this.props.handleChange}
                            value={this.props.topicTitle}
                            placeholder='Title'
                        />
                    </form>
                    <button className='topic-save' onClick={this.props.handleTopicFormSubmit}>Save</button>
                    <button className='topic-cancel' onClick={() => this.props.handleTopicForm('hide',0)}>Cancel</button>
                </div>
            </div>
        )
    }
}

class Dashboard extends React.Component {

    state = {
        topicEdit: false,
        topicFormEdit: false,
        topicFormShow: false,
    }

    handleTopicFormSubmit = () => {
        if(this.state.topicFormEdit === false){
            this.props.addTopic()
        } else {
            this.props.editTopic(this.state.topicEditId)
        }
        this.setState({topicFormShow: false})
    }

    handleTopicForm = (state,topicId) => {
        if(topicId > 0){
          this.setState({topicEditId: topicId})
        }
        if(state === 'add'){
          this.setState({topicFormEdit: false})
          this.setState({topicFormShow: true})
        } else if(state === 'edit'){
        // show edit form
        this.setState({topicFormEdit: true})
        this.setState({topicFormShow: true})
        } else if(state === 'hide'){
            this.setState({topicFormEdit: false})
            this.setState({topicFormShow: false})
        }
      }

    render () {
        return (
            <div className='dashboard'>
                <div className='topic-header'>
                    <h1>Available Topics</h1>
                    <button className='topic-add' onClick={() => this.handleTopicForm('add',0)} >Add Topic</button>
                </div>
                <div className='topic-container'>
                    {this.props.topics.map((topic,index) => (
                        <Topic 
                            key={topic.id}
                            title={topic.title}
                            index={index} 
                            id={topic.id}
                            viewTopic={this.props.viewTopic}
                            deleteTopic={this.props.deleteTopic}
                            handleTopicForm={this.handleTopicForm}
                        />
                    ))}
                </div>
                {this.state.topicFormShow ? 
                    <TopicForm 
                        addTopic={this.props.addTopic}
                        editTopic={this.props.editTopic}
                        handleChange={this.props.handleChange}
                        addTopicTitle={this.props.addTopicTitle}
                        handleTopicForm={this.handleTopicForm}
                        topicFormEdit={this.state.topicFormEdit}
                        handleTopicFormSubmit={this.handleTopicFormSubmit}
                /> : <div></div> }
            </div>
        )
    }
}
export default Dashboard