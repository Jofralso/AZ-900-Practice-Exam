// questions.js
var questions = [];
var shownQuestionIndices = []; // Array to store indices of already shown questions

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    showQuestion();
  })
  .catch(error => console.error('Error fetching questions:', error));

function selectRandomQuestions(numQuestions) {
  const remainingQuestions = questions.filter((_, index) => !shownQuestionIndices.includes(index));
  const numRemainingQuestions = remainingQuestions.length;

  if (numQuestions > numRemainingQuestions) {
    console.error('Not enough remaining questions.');
    return [];
  }

  const selectedIndices = [];
  while (selectedIndices.length < numQuestions) {
    const randomIndex = Math.floor(Math.random() * numRemainingQuestions);
    if (!selectedIndices.includes(randomIndex)) {
      selectedIndices.push(randomIndex);
    }
  }

  return selectedIndices.map(index => remainingQuestions[index]);
}

function showQuestion() {
  var quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = '';

  var selectedQuestions = selectRandomQuestions(50);

  selectedQuestions.forEach((question, index) => {
    var questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerHTML = `
      <p>${index + 1}. ${question.question}</p>
      <div class="options">
        ${question.options.map((option, i) => `
          <label>
            <input type="checkbox" name="question${index}" value="${i}" onclick="lockAnswer(${index}, this)">
            ${option}
          </label><br>
        `).join('')}
      </div>
      <button class="show-answer" onclick="showAnswer(${index})">Show Answer</button>
      <div class="hint-text" style="display: none;">Hint: ${question.options[question.correct_answers[0]]}</div>
    `;
    quizContainer.appendChild(questionElement);
  });
}

function showAnswer(index) {
  var questionElement = document.querySelectorAll('.question')[index];
  var userSelectedWrong = false; // Flag to check if the user selected a wrong answer

  questionElement.querySelectorAll('input').forEach((input, i) => {
    if (questions[index].correct_answers.includes(i)) {
      input.parentElement.classList.add('correct-answer');
    } else if (input.checked) {
      input.parentElement.classList.add('incorrect-answer');
      userSelectedWrong = true;
    }
    else{}
    input.disabled = true; // Lock all answers for the specific question
  });

  // Disable the "Show Answer" button after showing the correct answer
  var answerButton = questionElement.querySelector('.show-answer');
  answerButton.disabled = true;

  // If the user selected a wrong answer, unlock the incorrect options
  // if (userSelectedWrong) {
  //   questionElement.querySelectorAll('input:not(:checked)').forEach((input) => {
  //     input.disabled = false;
  //   });
  // }
}


function lockAnswer(index, clickedInput) {
  var questionElement = document.querySelectorAll('.question')[index];
  if (questionElement.querySelector('.show-answer').disabled) {
    return; // Return if answers have been shown
  }

  questionElement.querySelectorAll('input').forEach(input => {
    if (input !== clickedInput) {
      input.disabled = false; // Lock other options once an answer is selected
    }
  });
}


function checkAnswer() {
  var userAnswers = [];
  var correctCount = 0; // Track the total number of correct answers

  questions.forEach((question, index) => {
    var selectedOptions = document.querySelectorAll(`input[name="question${index}"]:checked`);
    var userSelection = Array.from(selectedOptions).map(option => parseInt(option.value));

    // Check if the user selected all correct options for the question
    var userSelectedCorrect = userSelection.length > 0 && userSelection.every((selectedOption) => question.correct_answers.includes(selectedOption));

    if (userSelectedCorrect) {
      correctCount++;
    }

    userAnswers.push({ question: index, selectedOptions: userSelection, userSelectedCorrect: userSelectedCorrect });
  });

  // Display correct and incorrect answers along with the correct count
  var quizContainer = document.getElementById('quiz-container');
  userAnswers.forEach((answer, index) => {
    var questionElement = quizContainer.querySelector(`.question:nth-child(${index + 1})`);

    questionElement.querySelectorAll('input').forEach((input, i) => {
      if (answer.selectedOptions.includes(i)) {
        if (questions[index].correct_answers.includes(i)) {
          input.parentElement.classList.add('correct-answer');
        } else {
          input.parentElement.classList.add('incorrect-answer');
        }
      } else if (questions[index].correct_answers.includes(i)) {
        input.parentElement.classList.add('correct-answer');
      }
      input.disabled = true; // Disable further changes after checking answers
    });
  });

  // Display percentage of correct answers along with the correct count
  var resultElement = document.createElement('div');
  resultElement.classList.add('result');

  var percentage = (correctCount / questions.length) * 100;
  var passPercentage = 70;
  resultElement.textContent = `Your Score: ${percentage.toFixed(2)}% (${correctCount} out of ${questions.length} correct)`;

  // Apply different styles based on the result
  if (percentage >= passPercentage) {
    resultElement.style.color = 'green'; // Green if passed
  } else {
    resultElement.style.color = 'red'; // Red if failed
  }

  quizContainer.appendChild(resultElement);

  // Display passing criteria information
  var passingInfoElement = document.createElement('div');
  passingInfoElement.classList.add('passing-info');
  var questionsToPass = Math.ceil((passPercentage * questions.length) / 100);
  passingInfoElement.textContent = `To pass, you need to answer at least ${questionsToPass} questions correctly (over ${passPercentage}%)`;
  quizContainer.appendChild(passingInfoElement);
}