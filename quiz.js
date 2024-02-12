// quiz.js
var currentQuestion = 0;
var score = 0;

function showQuestion() {
  var questionContainer = document.getElementById('question-container');
  var questionElement = document.getElementById('question');
  var optionsElement = document.getElementById('options');
  
  questionElement.textContent = questions[currentQuestion].question;

  // Clear previous options
  optionsElement.innerHTML = '';

  // Populate options
  questions[currentQuestion].options.forEach((option, index) => {
    var li = document.createElement('li');
    li.textContent = option;
    li.onclick = () => checkAnswer(index);
    optionsElement.appendChild(li);
  });
}

function checkAnswer(selectedIndex) {
  var correctAnswers = questions[currentQuestion].correct_answers;

  // Check if the selected index is in the correct answers array
  if (correctAnswers.includes(selectedIndex)) {
    score++;
  }

  // Move to the next question
  currentQuestion++;

  // Check if there are more questions
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    // Show final score
    alert('Quiz completed!\nYour score: ' + score + '/' + questions.length);
  }
}

function nextQuestion() {
  // Move to the next question
  currentQuestion++;

  // Check if there are more questions
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    // Show final score
    alert('Quiz completed!\nYour score: ' + score + '/' + questions.length);
  }
}
