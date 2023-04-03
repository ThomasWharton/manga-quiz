// Create constant for api url
const APIURL = 'https://opentdb.com/api.php?amount=10&category=31&type=multiple';
const question = document.getElementById('question');
const options = Array.from(document.getElementsByClassName('option-text'));

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
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
    return questionList.map(q => {
        return {
            question: q.question,
            correctAnswer: q.correct_answer,
            answers: [...q.incorrect_answers, q.correct_answer]
        }
    })
}

const presentQuestions = (questionList) => {
    console.log(questionList);
    question.innerText = questionList[0].question;
    options[0].innerText = questionList[0].answers[0];
    options[1].innerText = questionList[0].answers[1];
    options[2].innerText = questionList[0].answers[2];
    options[3].innerText = questionList[0].answers[3];
}

startQuiz = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...formattedQuestions];
    console.log(availableQuestions);
    nextQuestion();
}

/**
 * Waits for questions to fetched from API
 * then resolves json,
 * formats questions using formatQuestion function,
 * presents question in html.
 * 
 */
(async () => {
    const res = await fetch(APIURL);
    const fetchedQuestions = await res.json();
    const formattedQuestions = await formatQuestion(fetchedQuestions.results);
    const presentedQuestions = await presentQuestions(formattedQuestions);
})();
