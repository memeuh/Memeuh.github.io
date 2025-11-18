 const QUIZ_QUESTIONS = [
    {
        question: "What is Crawling?",
        options: ["An automated program that scans and downloads web pages", "A program that analyzes a website's data", 
                  "A program that filters webpages", "A program that gathers user input in a webpage"],
        answer: "An automated program that scans web pages"
    },
    {
        question: "What is Indexing?",
        options: ["Scanning and downloading a website's pages", "Analyzing a website's pages",
                  "A sitemap", "Ranking a website in search results"],
        answer: "Analyzing a website's pages"
    },
    {
        question: "Which URL below is properly structured?",
        options: ["example.com/blackwintercoats", "example.com/coats12345",
                  "example.com/coats/filter?color-profile=red", "example.com/redcoatspage3"],
        answer: "example.com/coats/filter?color-profile=red"
    },
    {
        question: "What is structured data?",
        options: ["Data that has been processed and analyzed", "Data from user input", "Raw data"],
        answer: "Data that has been processed and analyzed"
    },
    {
        question: "What is a Sitemap?",
        options: ["A Map of a Website", "A Website's Menu", "123abc", "userName"],
        answer: "123abc"
    },
    {
        question: "What determines relevancy?",
        options: ["Client's location", "Client's device", 
                  "Client's language", "All of the above"],
        answer: "All of the above"
    },
    {
        question: "What does PPC stand for?",
        options: ["Pay per cost", "Play per click", "Plant per click", "Pay per click"],
        answer: "Pay per click"
    },
    {
        question: "How is a website ranked in search results?",
        options: ["Quality of content", "Relevancy", "Usability","All of the above"],
        answer: "All of the above"
    },
{
        question: "What does SEM stand for?",
        options: ["Search Engine Making", "Scan Engine Marketing", 
                  "Search Engine Marketing", "Scout Engine Making"],
        answer: "Search Engine Marketing"
    },
  {
        question: "Which bot indexes mobile sites?",
        options: ["Googlebot Desktop", "Googlebot Storebot", 
                  "Googlebot Smartphone", "Googlebot Other"],
        answer: "Googlebot Smartphone"
    },  

  
];
const QuizState = {
    currentQuestionIndex: 0,
    score: 0,
    timeLeft: 15,
    timer: null,
    shuffledQuestions: [],
    isQuizActive: false
};

const Elements = {
    screens: {
        welcome: document.getElementById('welcome-screen'),
        rules: document.getElementById('rules-screen'),
        quiz: document.getElementById('quiz-screen'),
        results: document.getElementById('results-screen')
    },
    buttons: {
        startQuiz: document.getElementById('start-quiz-btn'),
        exitRules: document.getElementById('exit-rules-btn'),
        continueQuiz: document.getElementById('continue-quiz-btn'),
        stopQuiz: document.getElementById('stop-quiz-btn'),
        restartQuiz: document.getElementById('restart-quiz-btn'),
        backHome: document.getElementById('back-home-btn')
    },
    quiz: {
        questionCounter: document.getElementById('question-counter'),
        timer: document.getElementById('timer'),
        score: document.getElementById('score'),
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container')
    },
    results: {
        title: document.getElementById('results-title'),
        questionsAnswered: document.getElementById('questions-answered'),
        finalScore: document.getElementById('final-score'),
        percentage: document.getElementById('percentage'),
        message: document.getElementById('results-message')
    }
};
const Utils = {
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    showScreen(screenId) {
        Object.values(Elements.screens).forEach(screen => {
            screen.style.display = 'none';
        });
        Elements.screens[screenId].style.display = 'flex';
    },

    getPerformanceMessage(percentage, stoppedEarly = false) {
        if (stoppedEarly) {
            if (percentage >= 80) return 'Great job! You were doing excellent!';
            if (percentage >= 60) return 'Good work! You were on the right track!';
            if (percentage >= 40) return 'Keep practicing! You can improve!';
            return 'Don\'t give up! Practice makes perfect!';
        } else {
            if (percentage >= 80) return 'Excellent! You are an SEO expert!';
            if (percentage >= 60) return 'Good job! You are knowledgeable in SEO';
            if (percentage >= 40) return 'Not bad! Keep practicing to improve your skills!';
            return 'Keep studying! JavaScript takes time to master!';
        }
    }
};

const Quiz = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        Elements.buttons.startQuiz.addEventListener('click', () => this.showRules());
        Elements.buttons.exitRules.addEventListener('click', () => this.showWelcome());
        Elements.buttons.continueQuiz.addEventListener('click', () => this.startQuiz());
        Elements.buttons.stopQuiz.addEventListener('click', () => this.stopQuiz());
        Elements.buttons.restartQuiz.addEventListener('click', () => this.startQuiz());
        Elements.buttons.backHome.addEventListener('click', () => this.goHome());
    },

    showWelcome() {
        Utils.showScreen('welcome');
    },

    showRules() {
        Utils.showScreen('rules');
    },

    startQuiz() {
        QuizState.currentQuestionIndex = 0;
        QuizState.score = 0;
        QuizState.timeLeft = 15;
        QuizState.isQuizActive = true;
        QuizState.shuffledQuestions = Utils.shuffleArray(QUIZ_QUESTIONS);
        
        Utils.showScreen('quiz');
        this.showQuestion();
    },

    showQuestion() {
        if (QuizState.currentQuestionIndex >= QuizState.shuffledQuestions.length) {
            this.showResults();
            return;
        }

        const question = QuizState.shuffledQuestions[QuizState.currentQuestionIndex];
        
        Elements.quiz.questionCounter.textContent = `Question ${QuizState.currentQuestionIndex + 1} of ${QuizState.shuffledQuestions.length}`;
        Elements.quiz.score.textContent = `Score: ${QuizState.score}`;
        
        Elements.quiz.questionText.textContent = question.question;
        
        Elements.quiz.optionsContainer.innerHTML = question.options.map(option => 
            `<button class="option-btn" data-option="${option}">${option}</button>`
        ).join('');
        
        Elements.quiz.optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAnswer(e));
        });
        
        this.startTimer();
    },

    handleAnswer(event) {
        const selectedAnswer = event.target.dataset.option;
        const correctAnswer = QuizState.shuffledQuestions[QuizState.currentQuestionIndex].answer;
        
        this.stopTimer();
        
        if (selectedAnswer === correctAnswer) {
            QuizState.score++;
            event.target.classList.add('correct');
        } else {
            event.target.classList.add('incorrect');
            Elements.quiz.optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
                if (btn.dataset.option === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
        }
        
        Elements.quiz.optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        Elements.quiz.score.textContent = `Score: ${QuizState.score}`;
        
        setTimeout(() => {
            QuizState.currentQuestionIndex++;
            this.showQuestion();
        }, 2000);
    },

    startTimer() {
        QuizState.timeLeft = 15;
        Elements.quiz.timer.textContent = `Time: ${QuizState.timeLeft}s`;
        
        QuizState.timer = setInterval(() => {
            QuizState.timeLeft--;
            Elements.quiz.timer.textContent = `Time: ${QuizState.timeLeft}s`;
            
            if (QuizState.timeLeft <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    },

    stopTimer() {
        if (QuizState.timer) {
            clearInterval(QuizState.timer);
            QuizState.timer = null;
        }
    },

    handleTimeUp() {
        this.stopTimer();
        
        Elements.quiz.optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        const correctAnswer = QuizState.shuffledQuestions[QuizState.currentQuestionIndex].answer;
        Elements.quiz.optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            if (btn.dataset.option === correctAnswer) {
                btn.classList.add('correct');
            }
        });
        
        setTimeout(() => {
            QuizState.currentQuestionIndex++;
            this.showQuestion();
        }, 2000);
    },

    stopQuiz() {
        this.stopTimer();
        QuizState.isQuizActive = false;
        this.showResults(true);
    },

    showResults(stoppedEarly = false) {
        const questionsAnswered = QuizState.currentQuestionIndex;
        const percentage = Math.round((QuizState.score / QUIZ_QUESTIONS.length) * 100);
        
        Elements.results.title.textContent = stoppedEarly ? 'Quiz Stopped!' : 'Quiz Complete!';
        Elements.results.questionsAnswered.textContent = `${questionsAnswered}/${QuizState.shuffledQuestions.length}`;
        Elements.results.finalScore.textContent = `${QuizState.score}/${QuizState.shuffledQuestions.length}`;
        Elements.results.percentage.textContent = `${percentage}%`;
        Elements.results.message.textContent = Utils.getPerformanceMessage(percentage, stoppedEarly);
        
        Utils.showScreen('results');
    },

    goHome() {
        QuizState.currentQuestionIndex = 0;
        QuizState.score = 0;
        QuizState.isQuizActive = false;
        this.stopTimer();
        location.reload();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Quiz.init();
});
