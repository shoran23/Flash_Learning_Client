import React from  'react'

class TitleCard extends React.Component {
    render () {
        return (
            <div className='title-card' id={`title-${this.props.id}`} onClick={() => this.props.selectTitleCardId(this.props.id)}>
                <h4>{this.props.title}</h4>
            </div>
        )
    }
}

class DefinitionCard extends React.Component {
    render () {
        return (
            <div className='definition-card' id={`def-${this.props.id}`} onClick={() => this.props.selectDefinitionCardId(this.props.id)}>
                <p>{this.props.definition}</p>
            </div>
        )
    }
}
class QuizView extends React.Component {
    state = {
        topic: this.props.topic,
        selectedTitleCardId: 0,
        selectedDefinitionCardId: 0,
        correctMatches: 0,
        incorrectMatches: 0,
        quizComplete: false
    }

    cardMatchIsCorrect = id => {
        // increase correct match count
        this.setState({correctMatches: this.state.correctMatches + 1})
        // delete item from title column
        let title = document.getElementById(`title-${id}`);
        title.remove();
        // delete item from definition column
        let definition = document.getElementById(`def-${id}`);
        definition.remove();
        // see if quiz is complete
        if(this.state.correctMatches === this.state.topic.cards.length){
            this.setState({quizComplete: true})
        }
    }

    cardMatchIsIncorrect = () => {
        // increase incorrect match count
        this.setState({incorrectMatches: this.state.incorrectMatches + 1})
    }

    checkForMatch = () => {
        if(this.state.selectedTitleCardId === this.state.selectedDefinitionCardId){
            let tempId = this.state.selectedDefinitionCardId;
            if(tempId > 0){
                this.cardMatchIsCorrect(this.state.selectedDefinitionCardId)
            }
        } else {
            if(this.state.selectedTitleCardId > 0 && this.state.selectedDefinitionCardId > 0){
                this.cardMatchIsIncorrect()
            }
        }
        // reset for next attemp
        this.setState({selectedTitleCardId: 0})
        this.setState({selectedDefinitionCardId: 0})
    }

    selectTitleCardId = id => {
        this.setState({selectedTitleCardId: id})
    }

    selectDefinitionCardId = id => {
        this.setState({selectedDefinitionCardId: id})
        setTimeout(this.checkForMatch,100)
    }

    render () {

        console.log('title card id: ',this.state.selectedTitleCardId)
        console.log('definition card id: ',this.state.selectedDefinitionCardId)

        return (
            <div className='quiz'>
                <div className='quiz-header'>
                    <h1>{this.props.topic.title} Quiz</h1>
                    <h4>First select from the 'Term' column and then from the 'Definition' Column</h4>
                    <div className='quiz-scores'>
                        <div className='matches' id='correct-matches'>Correct Matches: {this.state.correctMatches}</div>
                        <div className='matches' id='incorrect-matches'>Incorrect Matches: {this.state.incorrectMatches}</div>
                    </div>
                    <button className='end-quiz' onClick={() => this.props.handleQuiz(false)}>End Quiz</button>
                </div>
                <div className='quiz-container'>
                    <div className='title-column'>
                        <h2>Terms</h2>
                        {this.props.topic.cards.map(card => (
                            <TitleCard 
                                key={card.id}
                                title={card.title}
                                id={card.id}
                                selectTitleCardId={this.selectTitleCardId}
                            />
                        ))}
                    </div>
                    <div className='definition-coloumn'>
                        <h2>Definitions</h2>
                        {this.props.topic.cards.map(card => (
                            <DefinitionCard 
                                key={card.id}
                                definition={card.definition}
                                id={card.id}
                                selectDefinitionCardId={this.selectDefinitionCardId}
                            />
                        ))}
                    </div>
                    { this.state.quizComplete ? 
                        <div>
                            <h1>Quiz Complete!</h1>
                        </div>
                    :   
                        <div></div>
                    }
                </div>
            </div>
        )
    }
}

export default QuizView;