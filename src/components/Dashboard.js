import React from  'react'

class Topic extends React.Component {
    getColor = index => {
        let color;
        if(index % 2 === 0) {
            color = '255,128,0'
        } else {
            color = '0,204,204'
        }
        return `rgba(${color},0.70)`
    }

    render () {
        return (
            <div style={{border: `10px solid ${this.getColor(this.props.index)}`}} className='topic'>
                <div className='topic-title' >{this.props.title}</div>
                <button className='topic-view' onClick={() => this.props.viewTopic(this.props.id)}>View</button>
                <button className='topic-delete' onClick={() => this.props.deleteTopic(this.props.id)} >Delete</button>
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
                        <h3>New Topic</h3>
                        <input 
                            type="text"
                            name="addTopicTitle"
                            id="addTopicTitle"
                            onChange={this.props.handleChange}
                            value={this.props.addTopicTitle}
                            placeholder='Title'
                        />
                    </form>
                    <button className='topic-save' onClick={this.props.addTopic}>Save</button>
                    <button className='topic-cancel' onClick={() => this.props.handleAddTopicView(false)}>Cancel</button>
                </div>
            </div>
        )
    }
}

class Dashboard extends React.Component {

    state = {
        showAddTopic: false
    }

    handleAddTopicView= state => {
        this.setState({showAddTopic: state})
    }

    render () {
        return (
            <div className='dashboard'>
                <div className='topic-header'>
                    <h1>Available Topics</h1>
                    <button className='topic-add' onClick={() => this.handleAddTopicView(true)} >Add Topic</button>
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
                        />
                    ))}
                </div>
                {this.state.showAddTopic ? 
                    <TopicForm 
                        addTopic={this.props.addTopic}
                        handleChange={this.props.handleChange}
                        addTopicTitle={this.props.addTopicTitle}
                        handleAddTopicView={this.handleAddTopicView}
                /> : <div></div> }
            </div>
        )
    }
}
export default Dashboard