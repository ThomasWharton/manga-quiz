const APIURL = 'https://opentdb.com/api.php?amount=10&category=31&type=multiple';
const question = document.getElementById('question');
const options = Array.from(document.getElementsByClassName('option-text'));
const quizStart = document.getElementById('start-quiz');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const restart = document.getElementById('restart');
const welcome = document.getElementById('welcome');
const quiz = document.getElementById('quiz');
const result = document.getElementById('result');
const leaderboard = document.getElementById('leaderboard');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;

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
            answers: [...q.incorrect_answers, q.correct_answer]
        }
    })
}

/**
 * Takes question from questionList,
 * edits html to display question and answers.
 */
const presentQuestions = (questionList) => {
    console.log(questionList);
    questionCounter++;
    question.innerHTML = questionList.question;
    options.forEach((option, index) => {
        option.innerHTML = questionList.answers[index];    
    });
    questionList.splice[0];
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
}
 

const checkAnswer = (selectedAnswer) => {
    if (selectedAnswer === questionList.correctAnswer) {
        score++;
        presentQuestions();
        } else {
            presentQuestions();
        }
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
    presentQuestions(formattedQuestions[0]);
};

window.addEventListener("DOMContentLoaded", (event) => {
    quizStart.addEventListener('click', startQuiz);
    restart.addEventListener('click', restartQuiz);
    initialise();
    options.forEach(option => {
        option.addEventListener('click', e => {
            const selectedOption = e.target;
            const selectedAnswer = selectedOption.dataset['number'];
            checkAnswer(selectedAnswer);
        });
    });
});