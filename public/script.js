/* ============================================
   Math Test for Kids - JavaScript Logic
   ============================================ */

// ============================================
// Game State Variables
// ============================================
let childName = '';
let currentQuestion = 0;
let score = 0;
let questions = [];
let isAnswering = false; // Prevent double-clicking

// Total number of questions in the quiz
const TOTAL_QUESTIONS = 10;

// ============================================
// DOM Elements
// ============================================
const welcomePage = document.getElementById('welcome-page');
const quizPage = document.getElementById('quiz-page');
const resultsPage = document.getElementById('results-page');

const childNameInput = document.getElementById('child-name');
const startBtn = document.getElementById('start-btn');
const printBtn = document.getElementById('print-btn');
const playAgainBtn = document.getElementById('play-again-btn');

const questionNumberEl = document.getElementById('question-number');
const totalQuestionsEl = document.getElementById('total-questions');
const progressFill = document.getElementById('progress-fill');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedback = document.getElementById('feedback');
const feedbackText = document.getElementById('feedback-text');

const resultName = document.getElementById('result-name');
const scoreNumber = document.getElementById('score-number');
const resultMessage = document.getElementById('result-message');

// ============================================
// Question Generation Functions
// ============================================

/**
 * Generate a random integer between min and max (inclusive)
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a simple math question suitable for kids (ages 5-9)
 * Operations: addition, subtraction, multiplication
 * Difficulty is adjusted to be simple
 */
function generateQuestion() {
    // Randomly choose operation: 0 = addition, 1 = subtraction, 2 = multiplication
    const operation = getRandomInt(0, 2);
    let num1, num2, answer, operator;

    switch (operation) {
        case 0: // Addition
            // Numbers between 1-10 for kids
            num1 = getRandomInt(1, 10);
            num2 = getRandomInt(1, 10);
            answer = num1 + num2;
            operator = '+';
            break;

        case 1: // Subtraction
            // Make sure result is positive (no negative numbers for kids)
            num1 = getRandomInt(2, 15);
            num2 = getRandomInt(1, num1); // num2 is always less than num1
            answer = num1 - num2;
            operator = '−'; // Using proper minus sign
            break;

        case 2: // Multiplication
            // Keep multiplication simple (1-5 times 1-10)
            num1 = getRandomInt(1, 5);
            num2 = getRandomInt(1, 10);
            answer = num1 * num2;
            operator = '×'; // Using multiplication sign
            break;
    }

    // Generate wrong answers (distractors)
    const wrongAnswers = generateWrongAnswers(answer);

    // Combine correct answer with wrong answers and shuffle
    const options = [answer, ...wrongAnswers];
    shuffleArray(options);

    return {
        question: `${num1} ${operator} ${num2} = ?`,
        answer: answer,
        options: options
    };
}

/**
 * Generate wrong answer choices that are close to the correct answer
 * This makes it more challenging but still doable for kids
 */
function generateWrongAnswers(correctAnswer) {
    const wrongAnswers = [];
    const usedAnswers = new Set([correctAnswer]);

    // Try to generate 3 unique wrong answers
    while (wrongAnswers.length < 3) {
        // Generate a number close to the correct answer
        let wrongAnswer;
        const offset = getRandomInt(1, 5);
        const direction = Math.random() > 0.5 ? 1 : -1;

        wrongAnswer = correctAnswer + (offset * direction);

        // Make sure wrong answer is positive and not already used
        if (wrongAnswer > 0 && !usedAnswers.has(wrongAnswer)) {
            wrongAnswers.push(wrongAnswer);
            usedAnswers.add(wrongAnswer);
        }
    }

    return wrongAnswers;
}

/**
 * Fisher-Yates shuffle algorithm to randomize array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Generate all questions for the quiz
 */
function generateAllQuestions() {
    questions = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        questions.push(generateQuestion());
    }
}

// ============================================
// Page Navigation Functions
// ============================================

/**
 * Show a specific page and hide others
 */
function showPage(page) {
    // Hide all pages
    welcomePage.classList.remove('active');
    quizPage.classList.remove('active');
    resultsPage.classList.remove('active');

    // Show the requested page
    page.classList.add('active');
}

/**
 * Start the quiz - validate name and initialize
 */
function startQuiz() {
    // Get and validate child's name
    childName = childNameInput.value.trim();
    
    if (!childName) {
        // If no name entered, use a default
        childName = 'Little Star';
        childNameInput.value = childName;
    }

    // Initialize quiz state
    currentQuestion = 0;
    score = 0;
    
    // Generate questions
    generateAllQuestions();

    // Update total questions display
    totalQuestionsEl.textContent = TOTAL_QUESTIONS;

    // Show first question
    showQuestion();

    // Navigate to quiz page
    showPage(quizPage);
}

/**
 * Display the current question
 */
function showQuestion() {
    const question = questions[currentQuestion];

    // Update progress
    questionNumberEl.textContent = currentQuestion + 1;
    const progressPercent = ((currentQuestion + 1) / TOTAL_QUESTIONS) * 100;
    progressFill.style.width = progressPercent + '%';

    // Set question text
    questionText.textContent = question.question;

    // Clear previous options
    optionsContainer.innerHTML = '';

    // Create answer buttons
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.dataset.value = option;
        button.addEventListener('click', () => handleAnswer(button, option));
        optionsContainer.appendChild(button);
    });

    // Hide feedback
    feedback.classList.add('hidden');
    feedback.classList.remove('correct', 'wrong');
    
    // Enable answering
    isAnswering = false;
}

/**
 * Handle when a child selects an answer
 */
function handleAnswer(button, selectedAnswer) {
    // Prevent double-clicking
    if (isAnswering) return;
    isAnswering = true;

    const correctAnswer = questions[currentQuestion].answer;
    const allButtons = optionsContainer.querySelectorAll('.option-btn');

    // Check if answer is correct
    if (selectedAnswer === correctAnswer) {
        // Show correct feedback
        button.classList.add('correct');
        feedback.textContent = '🎉 Great job!';
        feedback.classList.remove('wrong');
        feedback.classList.add('correct');
        score++;
    } else {
        // Show wrong feedback
        button.classList.add('wrong');
        feedback.textContent = '😅 Try again!';
        feedback.classList.remove('correct');
        feedback.classList.add('wrong');
        
        // Highlight the correct answer
        allButtons.forEach(btn => {
            if (parseInt(btn.dataset.value) === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }

    // Show feedback
    feedback.classList.remove('hidden');

    // Disable all buttons
    allButtons.forEach(btn => {
        btn.disabled = true;
    });

    // Wait 1.5 seconds then go to next question
    setTimeout(() => {
        currentQuestion++;

        if (currentQuestion < TOTAL_QUESTIONS) {
            // Show next question
            showQuestion();
        } else {
            // Quiz is over - show results
            showResults();
        }
    }, 1500);
}

/**
 * Display the results page
 */
function showResults() {
    // Update result elements
    resultName.textContent = childName;
    scoreNumber.textContent = score;

    // Generate appropriate message based on score
    const percentage = (score / TOTAL_QUESTIONS) * 100;
    
    if (percentage === 100) {
        resultMessage.textContent = '🌟 Perfect Score! You are a Math Genius! 🌟';
    } else if (percentage >= 80) {
        resultMessage.textContent = '🎉 Amazing! You are a Math Star! 🎉';
    } else if (percentage >= 60) {
        resultMessage.textContent = '👍 Great job! Keep practicing! 👍';
    } else {
        resultMessage.textContent = '💪 Good try! Practice makes perfect! 💪';
    }

    // Navigate to results page
    showPage(resultsPage);
}

/**
 * Reset the quiz to play again
 */
function playAgain() {
    // Reset name input for new game
    childNameInput.value = '';
    
    // Navigate back to welcome page
    showPage(welcomePage);
}

/**
 * Print the results
 */
function printResults() {
    window.print();
}

// ============================================
// Event Listeners
// ============================================

// Disable Start button at first
startBtn.disabled = true;

// Enable button when child writes name
childNameInput.addEventListener('input', () => {
    if (childNameInput.value.trim().length > 0) {
        startBtn.disabled = false;
    } else {
        startBtn.disabled = true;
    }
});

// Start button click
startBtn.addEventListener('click', startQuiz);

// Allow pressing Enter to start
childNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startQuiz();
    }
});

// Play again button
playAgainBtn.addEventListener('click', playAgain);

// Print button
printBtn.addEventListener('click', printResults);

// ============================================
// Initialize
// ============================================
// The page starts on the welcome page by default
// All initialization is done in the HTML and CSS
