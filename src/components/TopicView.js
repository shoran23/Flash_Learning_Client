import React from  'react'
import { Carousel } from 'react-responsive-carousel'

class Card extends React.Component {
    render () {
        return (
            <div className='card' >
                <h3 className='card-title'>{this.props.title}</h3>
                <p className='card-def'>{this.props.definition}</p>
                <button className='card-edit' onClick={() => {this.props.handleCardForm('edit')}}>Edit</button>
                <button className='card-delete' onClick={() => this.props.deleteCard(this.props.cardId)}>Delete</button>
            </div>
        )
    }
}

class CardForm extends React.Component {
    render () {
        return (
            <div className='card-form-background'>
            <div style={{border: `5x solid rgba(0,255,128)`}} className='card-form'>
                <form>
                    { !this.props.cardFormEdit ?
                        <h3>New Card</h3>
                    :
                        <h3>Edit Card</h3>
                    }
                    <input 
                        type="text"
                        name="cardTitle"
                        id="cardTitle"
                        onChange={this.props.handleChange}
                        value={this.props.cardTitle}
                        placeholder='Title'
                    />
                    <input 
                        type="text"
                        name="cardDefinition"
                        id="cardDefinition"
                        onChange={this.props.handleChange}
                        value={this.props.cardDefinition}
                        placeholder="Definition"
                    />
                </form>
                <button className='card-save' onClick={this.props.handleCardFormSubmit()}>Save</button>
                <button className='card-cancel' onClick={() => this.props.handleCardForm('hide')}>Cancel</button>
            </div>
        </div>
        )
    }
}

class TopicView extends React.Component {
    state = {
        cardTitle: "",
        cardDefinition: "",
        currentTopic: this.props.currentTopic,
        cardFormShow: false,
        cardFormEdit: true,
    }

    handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        })
    }

    clearCardForm = () => {
        this.setState({cardTitle: ""})
        this.setState({cardDefinition: ""})
    }

    viewTopic = () => {
        this.setState({currentTopic: {}})
        fetch(this.props.apiBaseURL + this.props.apiPort + '/topics/' + this.props.currentTopic.id)
        .then(data => data.json(), err => console.log(err))
        .then(parsedData => {
            this.setState({currentTopic: parsedData})
        })               
      }
    
    addCard = () => {
        fetch(this.props.apiBaseURL + this.props.apiPort + '/topics/' + this.props.currentTopic.id + '/cards', {
          method: 'POST',
          body: JSON.stringify({
            title: this.state.cardTitle,
            definition: this.state.cardDefinition,
            topic_id: this.state.currentTopic.id
          }),
          headers: {'Content-Type' : 'application/json'},
        }).then(res => res.json())
        .then(resJson => {console.log(resJson)})
        setTimeout(this.viewTopic,100)
    }

    editCard = id => {
        fetch(this.props.apiBaseURL + this.props.apiPort + '/cards/' + id, {
            methods: 'PUT',
            body: {
                title: this.state.cardTitle,
                definition: this.state.cardDefinition
            },
            headers: {'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(resJson => {
            console.log('edit card response: ',resJson)
        })
        setTimeout(this.viewTopic,100)
    }

    deleteCard = id => {
        fetch(this.props.apiBaseURL + this.props.apiPort + '/cards/' + id, {
            method: 'DELETE',
            headers: {'Content-Type' : 'application/json'}
        })
        .then(res => res.json)
        .then(resJson => {
            console.log('delete card response: ',resJson)
        })    
        setTimeout(this.viewTopic,100)
    }

    handleCardFormSubmit = id => {
        if(this.state.cardFormEdit === false){
            this.addCard();
        } else {
            this.editCard(id)
        }
    }

    handleCardForm = state => {
        if(state === 'add'){
            this.setState({cardFormEdit: false})
            this.setState({cardFormShow: true})
        } else if(state === 'edit'){
            this.setState({cardFormEdit: true})
            this.setState({cardFormShow: true})
        } else if(state === 'hide'){
            this.setState({cardFormEdit: false})
            this.setState({cardFormShow: false})
        }
    }

    render () {
        return (
            <div className='topic'>
                <div className='card-header'>
                    <h1>{this.props.title}</h1>
                    <button className='card-add' onClick={() => this.handleCardForm('add')}>Add Card</button>
                </div>
                { this.state.currentTopic.cards ? 
                    <div className='cards-container'>
                        {this.state.currentTopic.cards.map(card => (
                            <Card 
                                key={card.id}
                                title={card.title}
                                cardId={card.id}
                                definition={card.definition}
                                deleteCard={this.deleteCard}
                                handleCardForm={this.handleCardForm}
                            />
                        ))}
                    </div>
                : 
                    <div className='card-empty'>
                        <h3>No Cards Available</h3>
                    </div> 
                } 
                { this.state.cardFormShow ?
                    <CardForm 
                        currentTopic={this.state.currentTopic}
                        handleChange={this.handleChange}
                        handleCardForm={this.handleCardForm}
                        cardFormEdit={this.state.cardFormEdit}
                        handleCardFormSubmitd={this.handleCardFormSubmit}
                        cardTitle={this.state.cardTitle}
                        cardDefinition={this.state.cardDefinition}
                        apiBaseURL={this.props.apiBaseURL}
                        apiPort={this.props.apiPort}
                    />
                :
                    <div></div>
                }
            </div>
        )
    }
}

export default TopicView