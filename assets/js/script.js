const APIURL = 'https://opentdb.com/api.php?amount=10&category=31&type=multiple';
const question = document.querySelector('#question');
const options = Array.from(document.querySelectorAll('.option-text'));
const quizStart = document.querySelector('#start-quiz');
const leaderboardBtn = document.querySelector('#leaderboard-btn');
const restart = document.querySelector('#restart');
const welcome = document.querySelector('#welcome');
const quiz = document.querySelector('#quiz');
const result = document.querySelector('#result');
const leaderboard = document.querySelector('#leaderboard');
const currentScore = document.querySelector('#score');
const finalScore = document.querySelector('#final-score');
const home = document.querySelector('#home');
const resultMessage = document.querySelector('#result-message');


let scoreCounter = 0;
let questionCounter = 0;
let availableQuestions = [];

/**
 * 
 * @param {*} questionList 
 * Removes unneccessary data
 * @returns 
 * Formatted question
 */
const formatQuestion = (questionList) => {
    return questionList?.map(q => {
        return {
            question: q.question,
            correctAnswer: q.correct_answer,
            answers: shuffleAnswers([...q.incorrect_answers, q.correct_answer])
        }
    })
}

/**
 * 
 * @param {*} answersArray 
 * Gives negative or positive number to each answer
 * and sorts based on positivity
 * @returns 
 * Shuffled array
 */
const shuffleAnswers = (answersArray) => {
    return answersArray.sort(() => Math.random() - 0.5);
}

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
        finalScore.innerText = scoreCounter;
        if (finalScore > 5) {
            resultMessage.innerText = 'Well Done! =]'
        } else {
            resultMessage.innerText = 'Bad Luck =[';
        }
        
        quiz.classList.add('hidden');
        result.classList.remove('hidden');
        return;
    }
    questionCounter++;
    presentedQuestion = availableQuestions[0];
    question.innerHTML = presentedQuestion.question;
    options.forEach((option, index) => {
        option.innerHTML = presentedQuestion.answers[index];    
    });
    availableQuestions.splice(question, 1);
};

/**
 * 
 * @param {*} e
 * Checks selected answer and if correct adds point
 * and then calls for next question
 */
const checkAnswer = (e) => {
    const selectedOption = e.target.innerHTML;

    if (selectedOption == presentedQuestion.correctAnswer) {
        scoreCounter++;
        // currentScore.innerText = scoreCounter;        
    }
    presentQuestions();        
};


/**
 * Sets questionCounter and score to 0,
 * adds formattedQuestions to availableQuestion array,
 * logs available questions to console and
 * gets next question.
 */
const startQuiz = () => {
    questionCounter = 0;
    score = 0;
    resultMessage.innerText = "";
    welcome.classList.add('hidden');
    quiz.classList.remove('hidden');
}

/**
 * Adds hidden class to quiz window
 * then removes hidden class from welcome window
 * thus returning to welcome window.
 */
const restartQuiz = () => {
    quiz.classList.add('hidden');
    welcome.classList.remove('hidden');
    initialise();
}

/**
 * Adds hidden class to result window
 * then removes hidden class from welcome window
 * returns to welcome window
 */
const goHome = () => {
    result.classList.add('hidden');
    welcome.classList.remove('hidden');
    initialise();
}
 
/**
 * Waits for questions to be fetched from API
 * then resolves json,
 * formats questions using formatQuestion function,
 * presents question in html.
 * 
 */
const initialise = async() => {
    const res = await fetch(APIURL);
    const fetchedQuestions = await res.json();
    const formattedQuestions = await formatQuestion(fetchedQuestions.results);
    availableQuestions = [...formattedQuestions];
    console.log(availableQuestions);
    presentQuestions();
};

/**
 * Checks for DOM content to be loaded
 * Sets click event listeners to start, restart and home buttons.
 * Runs initialise function.
 * Sets click event listeners to answer options
 */
window.addEventListener("DOMContentLoaded", (event) => {

    quizStart.addEventListener('click', startQuiz);
    restart.addEventListener('click', restartQuiz);
    home.addEventListener('click', goHome);
    
    initialise();

    // Add click event listener for options
    options.forEach(option => {
        option.addEventListener('click', checkAnswer);
    })
});