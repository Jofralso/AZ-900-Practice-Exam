// questions.js
var questions = [];

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    questions = selectRandomQuestions(questions, 50);
    showQuestion();
  })
  .catch(error => console.error('Error fetching questions:', error));

function selectRandomQuestions(allQuestions, numQuestions) {
  const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
  return shuffledQuestions.slice(0, numQuestions);
}

function showQuestion() {
  var quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = '';

  var answersShown = false; // Flag to check if answers have been shown

  questions.forEach((question, index) => {
    var questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerHTML = `
      <p>${index + 1}. ${question.question}</p>
      <div class="options">
        ${question.options.map((option, i) => `
          <label>
            <input type="checkbox" name="question${index}" value="${i}" onclick="lockAnswer(${index}, this)" ${answersShown ? 'disabled' : ''}>
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
    input.disabled = true; // Lock the answer regardless of correct or incorrect
  });

  // Disable the "Show Answer" button after showing the correct answer
  var answerButton = questionElement.querySelector('.show-answer');
  answerButton.disabled = true;

  // If the user selected a wrong answer, unlock the incorrect options
  // if (userSelectedWrong) {
  //    questionElement.querySelectorAll('input:not(:checked)').forEach((input) => {
  //    input.disabled = false;
  //    });
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

  questions.forEach((question, index) => {
    var selectedOptions = document.querySelectorAll(`input[name="question${index}"]:checked`);
    var userSelection = Array.from(selectedOptions).map(option => parseInt(option.value));
    userAnswers.push({ question: index, selectedOptions: userSelection });
  });

  // Display correct and incorrect answers
  var quizContainer = document.getElementById('quiz-container');
  var correctCount = 0;

  questions.forEach((question, index) => {
    var questionElement = quizContainer.querySelector(`.question:nth-child(${index + 1})`);

    questionElement.querySelectorAll('input').forEach((input, i) => {
      if (userAnswers[index].selectedOptions.includes(i)) {
        // User selected this option
        if (question.correct_answers.includes(i)) {
          input.parentElement.classList.add('correct-answer');
          correctCount++;
        } else {
          input.parentElement.classList.add('incorrect-answer');
        }
      } else {
        // User did not select this option
        if (question.correct_answers.includes(i)) {
          input.parentElement.classList.add('correct-answer');
        }
      }
      input.disabled = true; // Disable further changes after checking answers
    });
  });

  // Display percentage of correct answers
  var resultElement = document.createElement('div');
  resultElement.classList.add('result');

  var percentage = (correctCount / questions.length) * 100;
  resultElement.textContent = `Your Score: ${percentage.toFixed(2)}%`;

  // Apply different styles based on the result
  if (percentage >= 70) {
    resultElement.style.color = 'green'; // Green if passed
  } else {
    resultElement.style.color = 'red'; // Red if failed
  }

  quizContainer.appendChild(resultElement);
}

