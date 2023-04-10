const questionRef = document.querySelector('#question');
const options = Array.from(document.querySelectorAll('.option-text'));
const quizStartBtnRef = document.querySelector('#start-quiz-btn');
const openLeaderboardBtnRef = document.querySelector('#open-leaderboard-btn');
const restartBtnRef = document.querySelector('#restart-btn');
const welcomeWindowRef = document.querySelector('#welcome');
const countersRef = document.querySelector('#counters');
const quizWindowRef = document.querySelector('#quiz');
const resultWindowRef = document.querySelector('#result');
const instructionsWindowRef = document.querySelector('#instructions')
const leaderboardWindowRef = document.querySelector('#leaderboard');
const currentScoreRef = document.querySelector('#current-score');
const questionNumberRef = document.querySelector('#question-number');
const finalScoreRef = document.querySelector('#final-score');
const homeBtnRef = document.querySelector('#home-btn');
const resultMessageRef = document.querySelector('#result-message');
const usernameInputRef = document.querySelector('#username');
const submitScoreBtnRef = document.querySelector('#submit-score-btn');
const closeLeaderboardBtnRef = document.querySelector('#close-leaderboard-btn');
const openInstructionsBtnRef = document.querySelector('#open-instructions-btn');
const closeInstructionsBtnRef = document.querySelector('#close-instructions-btn');
const highScoresListRef = document.querySelector('#high-scores-list');

const APIURL = 'https://opentdb.com/api.php?amount=10&category=31&type=multiple';
let scoreCounter = 0;
let questionCounter = 0;
let availableQuestions = [];
let highScores = JSON.parse(sessionStorage.getItem('highScores')) || [];

/**
 * Removes unneccessary data
 * @param {[]} questionList 
 * @returns Formatted question
 */
const formatQuestion = (questionList) => {
    return questionList?.map(q => {
        return {
            question: q.question,
            correctAnswer: q.correct_answer,
            answers: shuffleAnswers([...q.incorrect_answers, q.correct_answer])
        };
    });
};

/**
 * @param {[]} answersArray 
 * Gives negative or positive number to each answer
 * and sorts based on positivity
 * @returns Shuffled array
 */
const shuffleAnswers = (answersArray) => answersArray.sort(() => Math.random() - 0.5);

/**
 * Checks available question length,
 * if equal to 0, goes to result window.
 * If not equal to 0, takes question from availableQuestions array
 * @returns 
 * Question and answers from question and replaces innerHTML for quiz window.
 * Removes current question from array.
 */
const presentQuestions = () => {
    if (availableQuestions.length === 0) {
        finalScoreRef.innerText = scoreCounter;
        if (+finalScoreRef.innerText < 5) {
            resultMessageRef.innerText = 'Bad Luck =[';
        } else {
            resultMessageRef.innerText = 'Well Done! =]';
        }            
        quizWindowRef.classList.add('hidden');
        countersRef.classList.add('hidden');
        resultWindowRef.classList.remove('hidden');
        return;
    };
    questionCounter++;
    questionNumberRef.innerText = questionCounter;
    presentedQuestion = availableQuestions[0];
    questionRef.innerHTML = presentedQuestion.question;
    options.forEach((option, index) => {
        option.innerHTML = presentedQuestion.answers[index];    
    });
    availableQuestions.splice(question, 1);
};

/**
 * @param {event}
 * Checks selected answer and if correct adds point
 * and then calls for next question
 */
const checkAnswer = (event) => {
    const selectedOption = event.target;
    const selectedAnswer = selectedOption.innerHTML;

    if (selectedAnswer == presentedQuestion.correctAnswer) {
        scoreCounter++;
        currentScoreRef.innerText = scoreCounter;  
    } 
    const applyClass = selectedAnswer == presentedQuestion.correctAnswer ? 'correct' : 'incorrect';
    selectedOption.parentElement.classList.add(applyClass);

    setTimeout(() => {
        selectedOption.parentElement.classList.remove(applyClass);
        presentQuestions(); 
    }, 500);           
};


/**
 * Sets questionCounter and score to 0,
 * adds formattedQuestions to availableQuestion array,
 * and gets next question.
 */
const startQuiz = () => {
    questionCounter = 1;
    scoreCounter = 0;
    questionNumberRef.innerText = questionCounter;
    currentScoreRef.innerText = scoreCounter;
    resultMessageRef.innerText = "";
    welcomeWindowRef.classList.add('hidden');
    countersRef.classList.remove('hidden');
    quizWindowRef.classList.remove('hidden');
};

/**
 * Adds hidden class to quiz window
 * then removes hidden class from welcome window
 * thus returning to welcome window.
 */
const restartQuiz = () => {
    questionCounter = 1;
    scoreCounter = 0;    
    quizWindowRef.classList.add('hidden');
    countersRef.classList.add('hidden');
    welcomeWindowRef.classList.remove('hidden');
    initialise();
};

/**
 * Adds hidden class to result window
 * then removes hidden class from welcome window
 * returns to welcome window
 */
const goHome = () => {
    resultWindowRef.classList.add('hidden');
    welcomeWindowRef.classList.remove('hidden');
    initialise();
};

/**
 * Creates list item
 * @param {} submittedScore
 * @param {[]} highScores Adds submittedScore to array,
 * sorts and splices any item with index value >= 5
 * 
 * Saves highScores array to sessionStorage
 * then adds high scores to list on the leaderboard html
 * 
 * Calls initialise function to fetch questions again
 * and redirects to leaderboard 
 */
const submitScore = () => {
    if (!usernameInputRef.value){
        alert('Please enter a username');
        return
    }
    const submittedScore = {
        score: +finalScoreRef.innerText,
        user: usernameInputRef.value
    };    
    highScores.push(submittedScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);

    sessionStorage.setItem('highScores', JSON.stringify(highScores));

    highScoresListRef.innerHTML = highScores.map(highScore => {
        return `<li class='high-score'>
                    <span>${highScore.user}</span>
                    <span>${highScore.score}</span>
                </li>`;
    })
    .join('');
    initialise();

    resultWindowRef.classList.add('hidden');
    leaderboardWindowRef.classList.remove('hidden');
    closeLeaderboardBtnRef.addEventListener('click', closeLeaderboard);
};

/**
 * Adds hidden class to welcome window
 * and removes from instructions window
 */
const openInstructions = () => {
    welcomeWindowRef.classList.add('hidden');
    instructionsWindowRef.classList.remove('hidden');

    closeInstructionsBtnRef.addEventListener('click', closeInstructions);
}

/**
 * Adds hidden class to instruction window
 * and removes from welcome window 
 */
const closeInstructions = () => {
    instructionsWindowRef.classList.add('hidden');
    welcomeWindowRef.classList.remove('hidden');
}

/**
 * Adds hidden class to welcome window
 * and removes from leaderboard window 
 */
const openLeaderboard = () => {
    welcomeWindowRef.classList.add('hidden');
    leaderboardWindowRef.classList.remove('hidden');

    closeLeaderboardBtnRef.addEventListener('click', closeLeaderboard);  
};

/**
 * Adds hidden class to leaderboard window
 * and removes from welcome window 
 */
const closeLeaderboard = () => {    
    leaderboardWindowRef.classList.add('hidden');
    welcomeWindowRef.classList.remove('hidden');
}
 
/**
 * Waits for questions to be fetched from API
 * then resolves json,
 * formats questions using formatQuestion function,
 * presents question in html.
 */
const initialise = async() => {
    const res = await fetch(APIURL);
    const fetchedQuestions = await res.json();
    const formattedQuestions = await formatQuestion(fetchedQuestions.results);
    availableQuestions = [...formattedQuestions];
    presentQuestions();
};

/**
 * Checks for DOM content to be loaded
 * Sets click event listeners to start, restart and home buttons.
 * Runs initialise function.
 * Sets click event listeners to answer options
 */
window.addEventListener("DOMContentLoaded", (event) => {

    quizStartBtnRef.addEventListener('click', startQuiz);
    openInstructionsBtnRef.addEventListener('click', openInstructions);
    openLeaderboardBtnRef.addEventListener('click', openLeaderboard);
    restartBtnRef.addEventListener('click', restartQuiz);
    homeBtnRef.addEventListener('click', goHome);
    
    initialise();

    options.forEach(option => {
        option.addEventListener('click', checkAnswer);
    });
    
    submitScoreBtnRef.addEventListener('click', submitScore);

});