// Game state variables
let currentCategory = '';
let currentQuestions = 0;
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 10; // Default number of questions per category
let answered = false;
let quizCompleted = false; // Add a flag to track quiz completion

// DOM elements
const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const questionElement = document.getElementById('question');
const grade = document.getElementById('grade');
const answersContainer = document.getElementById('answers-container');
const scoreElement = document.getElementById('score');
const progressBar = document.getElementById('progress-bar');
const nextButton = document.getElementById('next-btn');
const homeButton = document.getElementById('home-btn');
const questionCountSelect = document.getElementById('question-count'); // New dropdown

// Event listeners
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        currentCategory = button.getAttribute('data-category');
        startQuiz(currentCategory);
    });
});

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < totalQuestions) {
        loadQuestion();
    } else {
        // End of quiz, show final score and grade
        quizCompleted = true; // Set the flag
        questionElement.textContent = `Quiz completed! Your final score: ${score}/${totalQuestions}`;
        const gradeResult = calculateGrade(score, totalQuestions);
        grade.textContent = gradeResult.grade;
        grade.style.color = gradeResult.color;
        grade.style.borderColor = gradeResult.color;

        answersContainer.innerHTML = '';
        nextButton.style.display = 'none';
        grade.style.display = 'flex'; // show the grade.
    }
});

homeButton.addEventListener('click', () => {
    // Reset and go back to home screen
    resetQuiz();
    quizScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    grade.style.display = 'none'; // hide the grade.
});

questionCountSelect.addEventListener('change', () => {
    totalQuestions = parseInt(questionCountSelect.value); // Update totalQuestions
});

/**
 * Starts the quiz for the selected category
 * @param {string} category - The selected quiz category
 */
function startQuiz(category) {
    // Get questions for the selected category
    currentQuestions = [...quizData[category]];

    // Shuffle the questions
    shuffleArray(currentQuestions);

    // Reset game state
    currentQuestionIndex = 0;
    score = 0;
    answered = false;
    quizCompleted = false; // reset the quiz complete flag.

    // Update UI
    scoreElement.textContent = `Score: ${score}`;
    progressBar.style.width = '0%';
    grade.style.display = 'none'; // hide grade at quiz start.

    // Show quiz screen, hide home screen
    homeScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');

    // Load the first question
    loadQuestion();
}

/**
 * Loads the current question and answers
 */
function loadQuestion() {
    // Reset state for new question
    answered = false;
    nextButton.style.display = 'none';

    const currentQuestion = currentQuestions[currentQuestionIndex];

    // Set question text
    questionElement.textContent = currentQuestion.question;

    // Clear previous answers
    answersContainer.innerHTML = '';

    // Shuffle answers
    const shuffledAnswers = [...currentQuestion.answers];
    shuffleArray(shuffledAnswers);

    // Create and add answer buttons
    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.classList.add('answer-btn');

        button.addEventListener('click', () => selectAnswer(button, answer.correct));
        answersContainer.appendChild(button);
    });
}

/**
 * Handles answer selection
 * @param {HTMLElement} selectedButton - The selected answer button
 * @param {boolean} isCorrect - Whether the selected answer is correct
 */
function selectAnswer(selectedButton, isCorrect) {
    // Prevent selecting multiple answers for the same question
    if (answered) return;

    answered = true;

    // Update button styles based on correctness
    if (isCorrect) {
        selectedButton.classList.add('correct');
        score++;
        scoreElement.textContent = `Score: ${score}`;
    } else {
        selectedButton.classList.add('incorrect');

        // Highlight the correct answer
        const buttons = answersContainer.querySelectorAll('.answer-btn');
        buttons.forEach(button => {
            // Find and highlight the correct answer
            const currentQuestion = currentQuestions[currentQuestionIndex];
            const correctAnswerText = currentQuestion.answers.find(answer => answer.correct).text;

            if (button.textContent === correctAnswerText) {
                button.classList.add('correct');
            }
        });
    }

    // Update progress bar
    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    // Show next button
    nextButton.style.display = 'inline-block';

    // Disable all answer buttons
    const buttons = answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach(button => {
        button.style.pointerEvents = 'none';
    });
}

/**
 * Resets the quiz state
 */
function resetQuiz() {
    currentCategory = '';
    currentQuestions = 0;
    currentQuestionIndex = 0;
    score = 0;
    answered = false;
    quizCompleted = false; // Reset quiz complete flag.
}

/**
 * Shuffles array elements randomly (Fisher-Yates algorithm)
 * @param {Array} array - The array to shuffle
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function calculateGrade(score, totalQuestions) {
    const percentage = (score / totalQuestions) * 100;

    if (percentage >= 97) {
        return { grade: 'A+', color: 'green' };
    } else if (percentage >= 93) {
        return { grade: 'A', color: 'green' };
    } else if (percentage >= 90) {
        return { grade: 'A-', color: 'green' };
    } else if (percentage >= 87) {
        return { grade: 'B+', color: 'lightgreen' };
    } else if (percentage >= 83) {
        return { grade: 'B', color: 'lightgreen' };
    } else if (percentage >= 80) {
        return { grade: 'B-', color: 'lightgreen' };
    } else if (percentage >= 77) {
        return { grade: 'C+', color: 'yellow' };
    } else if (percentage >= 73) {
        return { grade: 'C', color: 'yellow' };
    } else if (percentage >= 70) {
        return { grade: 'C-', color: 'yellow' };
    } else if (percentage >= 67) {
        return { grade: 'D+', color: 'orange' };
    } else if (percentage >= 63) {
        return { grade: 'D', color: 'orange' };
    } else if (percentage >= 60) {
        return { grade: 'D-', color: 'orange' };
    } else {
        return { grade: 'F', color: 'red' };
    }
}

