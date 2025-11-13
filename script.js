// Improved JS: Added timer extension, localStorage for high score, error handling, progressupdates, and better UX (e.g., disable options after selection).
// All code is modular, commented, and uses const/let appropriately.

const quizData = [
    {
        question: "What does 'let' declare in JavaScript?",
        options: ["A constant value", "A changeable variable", "A function", "An array"],
        correct: 1
    },
    {
        question: "Which is the strict equality operator?",
        options: ["==", "=", "===", "!="],
        correct: 2
    },
    {
        question: "What is the purpose of a for loop?",
        options: ["To declare variables", "To repeat code a set number of times", "To handle events", "To style elements"],
        correct: 1
    },
    {
        question: "How do you select an element by ID in the DOM?",
        options: ["querySelector", "getElementById", "createElement", "appendChild"],
        correct: 1
    },
    {
        question: "What is a closure in JavaScript?",
        options: ["A function inside another function that has access to its outer scope", "A way to close HTML tags", "An object that stores key-value pairs", "A method to terminate a loop"],
        correct: 0
    },
    {
        question: "What does the 'async' keyword do in JavaScript?",
        options: ["Pauses the code until the user clicks a button", "Allows the use of 'await' and returns a promise", "Runs a function faster than normal", "Stops the program when an error occurs"],
        correct: 1  
    }
    // Students: Add more here for extension!
];

let currentQuestion = 0;
let score = 0;
let totalQuestions = quizData.length;
let selectedAnswer = -1;
let timerInterval; // For per-question timer
let timeLeft = 30; // 30 seconds per question
let highScore = localStorage.getItem('jsQuizHighScore') || 0;

// Utility: Update progress bar
function updateProgress() {
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('current-q').textContent = currentQuestion + 1;
    document.getElementById('total-q').textContent = totalQuestions;
}

// Extension: Start timer for each question
function startTimer() {
    timeLeft = 30;
    document.getElementById('timer-container').style.display = 'block';
    document.getElementById('timer-text').textContent = timeLeft;
    document.getElementById('timer-fill').style.width = '100%';

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-text').textContent = timeLeft;
        document.getElementById('timer-fill').style.width = (timeLeft / 30 * 100) + '%';

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            nextQuestion(); // Auto-advance on timeout
        }
    }, 1000);
}

// Extension: Clear timer
function clearTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        document.getElementById('timer-container').style.display = 'none';
    }
}

function loadQuestion() {
    try {
        const q = quizData[currentQuestion];
        if (!q) throw new Error('No question data');
        document.getElementById('question').textContent = q.question;
        const optionsDiv = document.getElementById('options');
        optionsDiv.innerHTML = '';

        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.textContent = option;
            btn.classList.add('option');
            btn.setAttribute('aria-label', `Option: ${option}`);
            btn.onclick = () => selectOption(index);
            btn.addEventListener('keydown', (e) => {
                if (e,key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
            
            optionsDiv.appendChild(btn);
        });

        document.getElementById('next-btn').style.display = 'none';
        updateProgress();
        startTimer(); // Extension: Timer starts
    } catch (error) {
        console.error('Error loading question:', error);
        document.getElementById('question').innerHTML = '<p style="color: red;">Error loading question. Check console.</p>';
    }
}
function selectOption(index) {
    if (selectedAnswer !== -1) return; // Prevent multiple selections
    selectedAnswer = index;

    console.log("Selected:", index);
    
    clearTimer(); // Stop timer on answer

    const options = document.querySelectorAll('.option');
    options.forEach((opt, i) => {
        opt.disabled = true; // Disable after selection
        opt.classList.remove('correct', 'incorrect');

        if (i === quizData[currentQuestion].correct) {
            opt.classList.add('correct');
        } else if (i === index && index !== quizData[currentQuestion].correct) {
            opt.classList.add('incorrect');
        }
    });

    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    if (selectedAnswer === quizData[currentQuestion].correct) {
        score++;
    }

    currentQuestion++;
    selectedAnswer = -1;

    if (currentQuestion < totalQuestions) {
        loadQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    clearTimer();
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('score-container').style.display = 'block';

    const percentage = Math.round((score / totalQuestions) * 100);
    document.getElementById('score-circle-text').textContent = score;
    document.getElementById('total-score').textContent = totalQuestions;
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = totalQuestions;

    let feedback = '';
    if (percentage >= 80) feedback = "Outstanding! You're a JavaScript wizard. 🌟";
    else if (percentage >= 60) feedback = "Well done! Keep practicing those concepts. 👍";
    else feedback = "Good start—dive back into the lecture notes for a refresh. 📚";
    document.getElementById('feedback').textContent = feedback;

    // Extension: High score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('jsQuizHighScore', highScore);
        document.getElementById('high-score').style.display = 'block';
        document.getElementById('high-score-val').textContent = highScore;
    }

    if (percentage === 100) {
        confetti({
            particleCount: 300,
            spread: 160,
            origin: { y: 0.6 }
        });
    }
}

function restartQuiz() {
    quizData.sort(() => Math.random() - 0.5);
    currentQuestion = 0;
    score = 0;
    selectedAnswer = -1;
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('score-container').style.display = 'none';
    document.getElementById('high-score').style.display = 'none';
    loadQuestion();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadQuestion);