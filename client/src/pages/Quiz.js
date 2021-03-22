import React, { Component } from 'react';
import Container from '../components/Container';
import LangOptions from '../components/LangOptions';
import Card from '../components/Card';

import jCharactersHir from '../jCharacters-hir.json';
import jCharactersHirDak from '../jCharacters-hir-dak.json';
import jCharactersHirCombo from '../jCharacters-hir-combo.json';
import jCharactersKat from '../jCharacters-kat.json';
import jCharactersKatDak from '../jCharacters-kat-dak.json';
import jCharactersKatCombo from '../jCharacters-kat-combo.json';
import jCharactersSmallLetters from '../jCharacters-smallLetters.json';
import jCharactersSymbols from '../jCharacters-symbols.json';

class Quiz extends Component {

    state={
        hiragana: [],
        katakana: [],
        accents: [],
        kanji: [],
        rHiragana: [],
        rKatakana: [],
        rAccents: [],
        rKanji: [],
        correctFlash:[],
        wrongFlash: [],
        flashCardIndex: 0,
        flashCardSelections: [""],
        flashCardsOn: true,
        guessInput: [],
        answerOutcome: null
    };

    handleInputChange = (name, value) => {
        this.setState({
            [name]: value
        });
    };

    /* Function will import the json files for the different languages and randomize them using the Fisher-Yates shuffle. Function should be accessible for use in multiple locations and should be allowed to re-randomize the given arrays base off input received from the pages. */
    importAndShuffleArray = ()=> {
        // Solution found here using the Fisher-Yates shuffle. Has been adapted to use ES6 and custom variables: https://javascript.info/task/shuffle 

        // import to variables done here to prevent multiple page re-rendering before displaying
        const hir = [jCharactersHir, jCharactersHirDak, jCharactersHirCombo];
        const kat = [jCharactersKat, jCharactersKatDak, jCharactersKatCombo];
        const acc = [jCharactersSmallLetters, jCharactersSymbols];

        /* Add each imported language to a parent array. */
        const parent= [hir, kat, acc];

        /* Itterate through each of the parent's arrays, then through each of those children's arrays. In the parent and child, assign a shorthand variable to track the given parent and child indexes. In the grandchild, randomize the order of the grandchild inside the child using the shorthand and random number. Child arrays will now be shuffled randomly. */
        parent.forEach( (value, index) => {
            let parentIndex= parent[index]
            value.forEach( (val, ind) => {
                let childIndex = parentIndex[ind];
                val.forEach( (v, i) => {
                    /* Assign the random number to a varialbe to be called later. Variable creates a random number between 0 & 1 and adds 1 to it. */
                    let random = Math.floor(Math.random() * (i +1));

                    [childIndex[i], childIndex[random]] = [childIndex[random], childIndex[i]];
                });
            });
        });

        this.setState({
            hiragana: hir,
            katakana: kat,
            accents: acc,
            rHiragana: parent[0],
            rKatakana: parent[1],
            rAccents: parent[2],
            flashCardSelections: parent[0][0]
        }, ()=> console.log("parent Quiz: ", parent));
    };

    /* Assign the current state of the letters guessed to a variable. Add the key pressed to gInput. Take card selections and the current card index and assign to variable. Create function to itterate to the next card and reset to basic states. */
    entryValidation = (e)=> {
        let gInput = this.state.guessInput;
        gInput += e.key;

        const cardSelections = this.state.flashCardSelections;
        const cardIndex = this.state.flashCardIndex;

        let nextCard = ()=> {
            // DRY function to increment cardIndex and reset state.
            setTimeout(()=> {
                cardIndex++
                this.setState({
                    answerOutcome: null,
                    flashCardIndex: cardIndex,
                    guessInput: []
                });
            }, 1000);
        };

        /* Validate if the current guess equals the length of the english translation. If so, run nested if to validate if the input matches the english translation strig or alternate translation exactly. If it does then change states to show correct and add that item to the correctly guessed flash cards. If not then show wrong and assign that item to the incorrectly guessed. After showing correct/incorrect, run the nextCard function. */
        if( gInput.length === cardSelections[cardIndex].englishTranslation.length ) {

            if( gInput === cardSelections[cardIndex].englishTranslation || gInput === cardSelections[cardIndex].alternateEnglishTranslation ) {
                
                /* Set background to green. increment card index. clear guessInput. assign to correctFlash */
                let addCorrect = this.state.correctFlash;
                addCorrect.push(cardSelections[cardIndex]);
                this.setState({
                    answerOutcome: true,
                    correctFlash: addCorrect
                }, nextCard());

            } else {
                /* Set background to red. Increment card index. Clear guessInput. Assign to wrongFlash */
                let addWrong = this.state.wrongFlash;
                addWrong.push(cardSelections[cardIndex]);
                this.setState({
                    answerOutcome: false,
                    wrongFlash: addWrong
                }, nextCard());
            };
        };
    };

    componentDidMount() {
        this.importAndShuffleArray();
        document.addEventListener("keydown", this.entryValidation);
    };

    render() {
        // let fCS= this.state.flashCardSelections;
        // let fCI= this.state.flashCardIndex;
        return (
            <Container
                className={"fluid"}
            >
                <Container>
                    <h1>Select options:</h1>
                    
                    <LangOptions
                        handleChange={this.handleInputChange.bind(this)}
                        hir="quiz-hir"
                        hirDak="quiz-hirDak"
                        hirCombo="quiz-hirCombo"
                        kat="quiz-kat"
                        katDak="quiz-katDak"
                        katCombo="quiz-katCombo"
                        />
                    <button type="button">Start</button>

                    {/* TODO: 
                        Adjust CSS formatting for how many colums should fit on a page for different breakpoints
                        Make it so cards do not appear before options are selected above and a button is pressed to start
                    */}
                    <div className="row row-cols-3 g-0">
                        {this.state.flashCardSelections.map( (value, index) => (
                            <div className="col" key={index}>
                                <Card 
                                    handleChange={this.handleInputChange.bind(this)}
                                    // character={fCS[fCI].character}
                                    // translation={fCS[fCI].englishTranslation}
                                    guessInput={this.state.guessInput}
                                    on={this.state.flashCardsOn}
                                    outcome={this.state.answerOutcome}
                                    />
                            </div>
                        ))}
                    </div>
    
                </Container>
    
            </Container>
        );
    }
}

export default Quiz;