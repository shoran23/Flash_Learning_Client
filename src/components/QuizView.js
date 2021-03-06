import React from  'react'

class TitleCard extends React.Component {
    render () {
        return (
            <div 
                style={{border: `10px solid ${this.props.getColor(this.props.index)}`}} 
                className='title-card' 
                id={`title-${this.props.id}`} 
                onClick={() => this.props.selectTitleCardId(this.props.id,this.props.index)}
            >
                <h4>{this.props.title}</h4>
            </div>
        )
    }
}

class DefinitionCard extends React.Component {
    render () {
        return (
            <div 
                style={{border: `10px solid ${this.props.getColor(this.props.index)}`}}
                className='definition-card' 
                id={`def-${this.props.id}`} 
                onClick={() => this.props.selectDefinitionCardId(this.props.id,this.props.index)}
            >
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
        quizComplete: false,
        titleList: [],
        defList: []
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
        this.clearTitleCardBackground()
        this.clearDefinitionCardBackground();
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

    clearTitleCardBackground = () => {
        let titles = document.getElementsByClassName("title-card");
        console.log(titles)
        for(let i=0;i<titles.length;i++){
            let title = document.getElementById(titles[i].id)
            title.style.backgroundColor = 'white'
        }
    }

    clearDefinitionCardBackground = () => {
        let definitions = document.getElementsByClassName("definition-card");
        for(let i=0;i<definitions.length;i++){
            let definition = document.getElementById(definitions[i].id)
            definition.style.backgroundColor = 'white'
        }
    }

    selectTitleCardId = (id,index) => {
        this.clearTitleCardBackground()
        let selectedTitle = document.getElementById(`title-${id}`)
        selectedTitle.style.backgroundColor = 'rgba(102,178,255,1)'
        this.setState({selectedTitleCardId: id})
    }

    selectDefinitionCardId = (id,index) => {
        this.clearDefinitionCardBackground()
        let selectedDef = document.getElementById(`def-${id}`)
        selectedDef.style.backgroundColor = 'rgba(102,178,255,1)'
        this.setState({selectedDefinitionCardId: id})
        setTimeout(this.checkForMatch,100)
    }

    shuffleArr = array => {
        var currentIndex = array.length;
        var temporaryValue, randomIndex;
        // while there remain elements to shuffle
        while(0 !== currentIndex) {
            // pick a remaining element
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // swap it with the current element
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };

    getColor = index => {
        let color;
        if(index % 2 === 0) {
            color = '0,204,204'
        } else {
            color = '255,128,0'
        }
        return `rgba(${color},0.70)`
    }

    render () {
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
                    <div className='title-column' id='title-col'>
                        <h2>Terms</h2>
                        {this.props.topic.cards.map((card,index) => (
                            <TitleCard 
                                key={card.id}
                                title={card.title}
                                id={card.id}
                                selectTitleCardId={this.selectTitleCardId}
                                getColor={this.getColor}
                                index={index}
                            />
                        ))}
                    </div>
                    <div className='definition-column' id='definition=col'>
                        <h2>Definitions</h2>
                        {this.props.topic.cards.map((card,index) => (
                            <DefinitionCard 
                                key={card.id}
                                definition={card.definition}
                                id={card.id}
                                selectDefinitionCardId={this.selectDefinitionCardId}
                                getColor={this.getColor}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
                { this.state.quizComplete ? 
                        <div>
                            <h1 className='quiz-complete'>Quiz Complete!</h1>
                        </div>
                    :   
                        <div></div>
                    }
            </div>
        )
    }
    componentDidMount() {
        let arr = [1,2,3,4,5,6]
        console.log(this.shuffleArr(arr))
    }
}
export default QuizView;