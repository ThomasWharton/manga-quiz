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

let scoreCounter = 0;
let questionCounter = 0;
let availableQuestions = [];

// Constants
const correctAnswerPoint = 1;
const maxQuestions = 10;

/**
 * Takes question fetched from api,
 * removes unnecessary data and
 * returns formatted question
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

const shuffleAnswers = (answersArray) => {
    return answersArray.sort(() => Math.random() - 0.5);
}

/**
 * Takes question from questionList,
 * edits html to display question and answers.
 */
const presentQuestions = () => {
    if (availableQuestions.length === 0 || questionCounter >= maxQuestions) {
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
    acceptingAnswers = true;
};

const checkAnswer = (e) => {
    const selectedOption = e.target.innerHTML;

    if (selectedOption == presentedQuestion.correctAnswer) {
        scoreCounter++;
        // currentScore.innerText = scoreCounter;
        finalScore.innerText = scoreCounter;
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

const goHome = () => {
    result.classList.add('hidden');
    welcome.classList.remove('hidden');
    initialise();
}
 
/**
 * Waits for questions to fetched from API
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

window.addEventListener("DOMContentLoaded", (event) => {
    quizStart.addEventListener('click', startQuiz);
    restart.addEventListener('click', restartQuiz);
    home.addEventListener('click', goHome);
    
    initialise();

    // Add click event listener by option
    options.forEach(option => {
        option.addEventListener('click', checkAnswer);
    })
});