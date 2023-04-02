// Create constant for api url
const APIURL = 'https://opentdb.com/api.php?amount=10&category=31&type=multiple';
const question = document.getElementById('question');
const options = Array.from(document.getElementsByClassName('option-text'));


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

/**
 * Fetch questions from API,
 * format questions using formatQuestion function,
 * returns formatted questions
 */
const fetchQuestionList = () => {
    fetch(APIURL)
        .then((res) => res.json())
        .then((fetchedQuestions) => formatQuestion(fetchedQuestions.results))
            .then(getFormattedQuestions => {
                const formattedQuestions = formatQuestion.results;
                console.log(formattedQuestions);
            })
}

fetchQuestionList();