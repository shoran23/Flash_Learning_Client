import React from  'react'
import {CarouselProvider, Slider, Slide, ButtonBack, ButtonNext} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

class Card extends React.Component {
    render () {
        return (
            <div className='card' >
                <h3 className='card-title'>{this.props.title}</h3>
                <div className='card-body'>
                    <p className='card-def'>{this.props.definition}</p>
                    <div className='card-options'>
                        <button className='card-edit' onClick={() => this.props.handleCardForm('edit',this.props.cardId)}>Edit</button>
                        <button className='card-delete' onClick={() => this.props.deleteCard(this.props.cardId)}>Delete</button>
                    </div>
                </div>
            </div>
        )
    }
}

class CardForm extends React.Component {
    render () {
        return (
            <div className='card-form-background'>
            <div className='card-form'>
                <form>
                    { !this.props.cardFormEdit ?
                        <h3 className='card-form-title-new' >New Card</h3>
                    :
                        <h3 className='card-form-title-edit' >Edit Card</h3>
                    }
                    <div className='card-form-body'>
                        <input 
                            className='cord-form-title'
                            type="text"
                            name="cardTitle"
                            id="cardTitle"
                            onChange={this.props.handleChange}
                            value={this.props.cardTitle}
                            placeholder='Title'
                        />
                        <input 
                            className='card-form-def'
                            type="text"
                            name="cardDefinition"
                            id="cardDefinition"
                            onChange={this.props.handleChange}
                            value={this.props.cardDefinition}
                            placeholder="Definition"
                        />
                    </div>
                </form>
                <div className='card-form-options'>
                    <button className='card-save' onClick={this.props.handleCardFormSubmit}>Save</button>
                    <button className='card-cancel' onClick={() => this.props.handleCardForm('hide',0)}>Cancel</button>
                </div>
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
        cardEditId: 0,
        selectedCardIndex: 0
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
        // clear card form state
        this.setState({cardTitle: ""})
        this.setState({cardDefinition: ""})
        // hide card form
        this.handleCardForm('hide',0)

    }

    editCard = id => {
        fetch(this.props.apiBaseURL + this.props.apiPort + '/cards/' + id, {
            method: 'PUT',
            body: JSON.stringify({
                title: this.state.cardTitle,
                definition: this.state.cardDefinition
            }),
            headers: {'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(resJson => {
            console.log('edit card response: ',resJson)
        })
        setTimeout(this.viewTopic,100)
        // clear card form state
        this.setState({cardTitle: ""})
        this.setState({cardDefinition: ""})
        // hide card form
        this.handleCardForm('hide',0)
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

    handleCardFormSubmit = () => {
        if(this.state.cardFormEdit === false){
            this.addCard();
        } else {
            this.editCard(this.state.cardEditId)
        }
    }

    handleCardForm = (state,cardId) => {
        if(cardId > 0){
            this.setState({cardEditId: cardId})
        }
        if(state === 'add'){
            this.setState({cardFormEdit: false})
            this.setState({cardFormShow: true})
        } else if(state === 'edit'){
            // find current card info
            let cardArr = this.state.currentTopic.cards
            let currentCard = {}
            for(let i=0;i<cardArr.length;i++){
                if(cardArr[i].id === cardId){
                    currentCard = cardArr[i]
                    break;
                }
            }
            // set up form with current card info
            this.state.cardTitle = currentCard.title
            this.state.cardDefinition = currentCard.definition
            // show edit form
            this.setState({cardFormEdit: true})
            this.setState({cardFormShow: true})
        } else if(state === 'hide'){
            this.setState({cardFormEdit: false})
            this.setState({cardFormShow: false})
            this.setState({cardTitle: ""})
            this.setState({cardDefinition: ""})
        }
    }

    selectCard = index => {
        this.setState({selectedCardIndex: index})
        // clear all other cards style
        for(let i=0;i<this.state.currentTopic.cards.length;i++){
            let clearCard = document.getElementById(`card-select-${i}`)
            clearCard.style = 'border-bottom: 5px solid rgba(102,102,255,0)'

        }
        // set the selected card styl
        let selectedCard = document.getElementById(`card-select-${index}`);
        selectedCard.style = 'border-bottom: 5px solid rgba(102,102,255,1)';
    }

    render () {
        return (
            <div className='topic-card'>
                <div className='card-header'>
                    <h1>{this.props.title}</h1>
                    <div className='card-options-header'>
                        <button className='card-add' onClick={() => this.handleCardForm('add')}>Add Card</button>
                        <button className='take-quiz' onClick={() => this.props.handleQuiz(true)}>Take Quiz</button>
                    </div>
                </div>
                { this.state.currentTopic.cards ? 
                    <div className='cards-container'>
                        <div className='cards-nav'>
                            {this.state.currentTopic.cards.map((card,index) => (
                                <button className='card-select' id={`card-select-${index}`}key={index} onClick={() => this.selectCard(index)}>{card.title}</button>
                            ))}
                        </div>
                        <Card 
                            title={this.state.currentTopic.cards[this.state.selectedCardIndex].title}
                            cardId={this.state.currentTopic.cards[this.state.selectedCardIndex].id}
                            definition={this.state.currentTopic.cards[this.state.selectedCardIndex].definition}
                            deleteCard={this.deleteCard}
                            handleCardForm={this.handleCardForm}
                        />
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

                        handleCardFormSubmit={this.handleCardFormSubmit}

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
    componentDidMount() {
        this.selectCard(0)
    }
}

export default TopicView