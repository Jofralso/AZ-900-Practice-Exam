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

  questions.forEach((question, index) => {
    var questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerHTML = `
      <p>${index + 1}. ${question.question}</p>
      <div class="options">
        ${question.options.map((option, i) => `
          <label>
            <input type="checkbox" name="question${index}" value="${i}">
            ${option}
          </label><br>
        `).join('')}
      </div>
      <span class="hint" onclick="showHint(${index})">Show Hint</span>
      <div class="hint-text" style="display: none;">Hint: ${question.options[question.correct_answers[0]]}</div>
    `;
    quizContainer.appendChild(questionElement);
  });
}

function showHint(index) {
  var hintElement = document.querySelectorAll('.hint-text')[index];
  hintElement.style.display = 'block';
}

function checkAnswer() {
  var userAnswers = [];

  questions.forEach((question, index) => {
    var selectedOptions = document.querySelectorAll(`input[name="question${index}"]:checked`);
    var userSelection = Array.from(selectedOptions).map(option => parseInt(option.value));
    userAnswers.push({ question: index, selectedOptions: userSelection });
  });

  console.log(userAnswers);
  // You can now process the user's answers as needed
}
