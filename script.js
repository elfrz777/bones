class BonesApp {
    constructor() {
        this.bones = [];
        this.currentBoneIndex = 0;
        this.currentQuizIndex = 0;
        this.initializeApp();
    }

    async initializeApp() {
        await this.loadBones();
        this.setupEventListeners();
        this.showTab('learn');
        this.displayCurrentBone();
        this.populateBonesTable();
    }

    async loadBones() {
        try {
            const response = await fetch('http://localhost:3001/api/bones');
            this.bones = await response.json();
        } catch (error) {
            console.error('Error loading bones:', error);
        }
    }

    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.showTab(tab);
            });
        });

        // Управление обучением
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.currentBoneIndex = (this.currentBoneIndex - 1 + this.bones.length) % this.bones.length;
            this.displayCurrentBone();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.currentBoneIndex = (this.currentBoneIndex + 1) % this.bones.length;
            this.displayCurrentBone();
        });

        document.getElementById('random-btn').addEventListener('click', () => {
            this.currentBoneIndex = Math.floor(Math.random() * this.bones.length);
            this.displayCurrentBone();
        });

        // Викторина
        document.getElementById('submit-answer').addEventListener('click', () => {
            this.checkAnswer();
        });

        document.getElementById('next-question').addEventListener('click', () => {
            this.nextQuizQuestion();
        });

        document.getElementById('answer-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
    }

    showTab(tabName) {
        // Скрыть все вкладки
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Деактивировать все кнопки
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Показать выбранную вкладку
        document.getElementById(tabName).classList.add('active');
        
        // Активировать соответствующую кнопку
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Если выбрана викторина, начать новую
        if (tabName === 'quiz') {
            this.startQuiz();
        }
    }

    displayCurrentBone() {
        if (this.bones.length === 0) return;

        const bone = this.bones[this.currentBoneIndex];
        document.getElementById('bone-name').textContent = bone.english;
        document.getElementById('bone-description').textContent = bone.description;
        document.getElementById('bone-translation').textContent = bone.russian;
    }

    populateBonesTable() {
        const tableBody = document.getElementById('bones-table');
        tableBody.innerHTML = '';

        this.bones.forEach(bone => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bone.english}</td>
                <td>${bone.russian}</td>
                <td>${bone.description}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    async startQuiz() {
        try {
            const response = await fetch('http://localhost:3001/api/quiz');
            this.quizBones = await response.json();
            this.currentQuizIndex = 0;
            this.showQuizQuestion();
        } catch (error) {
            console.error('Error starting quiz:', error);
        }
    }

    showQuizQuestion() {
        if (!this.quizBones || this.quizBones.length === 0) return;

        const bone = this.quizBones[this.currentQuizIndex];
        document.getElementById('quiz-russian').textContent = bone.russian;
        document.getElementById('answer-input').value = '';
        document.getElementById('quiz-feedback').textContent = '';
        document.getElementById('next-question').style.display = 'none';
        document.getElementById('submit-answer').style.display = 'block';
        document.getElementById('answer-input').focus();
    }

    async checkAnswer() {
        const answer = document.getElementById('answer-input').value.trim();
        if (!answer) return;

        const bone = this.quizBones[this.currentQuizIndex];

        try {
            const response = await fetch('http://localhost:3001/api/check-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    boneId: bone.id,
                    answer: answer
                })
            });

            const result = await response.json();
            const feedback = document.getElementById('quiz-feedback');

            if (result.isCorrect) {
                feedback.textContent = '✅ Correct! Well done!';
                feedback.className = 'correct';
            } else {
                feedback.textContent = `❌ Incorrect. The correct answer is: ${result.correctAnswer}`;
                feedback.className = 'incorrect';
            }

            document.getElementById('submit-answer').style.display = 'none';
            document.getElementById('next-question').style.display = 'block';
        } catch (error) {
            console.error('Error checking answer:', error);
        }
    }

    nextQuizQuestion() {
        this.currentQuizIndex = (this.currentQuizIndex + 1) % this.quizBones.length;
        this.showQuizQuestion();
    }
}

// Запуск приложения после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    new BonesApp();
});