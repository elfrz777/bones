class BonesApp {
    constructor() {
        this.bones = this.getBonesData();
        this.currentBoneIndex = 0;
        this.currentQuizIndex = 0;
        this.quizBones = [];
        this.initializeApp();
    }

    getBonesData() {
        return [
            { id: 1, english: "Skull", russian: "Череп", description: "Костная структура головы" },
            { id: 2, english: "Mandible", russian: "Нижняя челюсть", description: "Нижняя челюстная кость" },
            { id: 3, english: "Clavicle", russian: "Ключица", description: "Кость соединяющая грудину с лопаткой" },
            { id: 4, english: "Scapula", russian: "Лопатка", description: "Кость плечевого пояса" },
            { id: 5, english: "Sternum", russian: "Грудина", description: "Центральная кость грудной клетки" },
            { id: 6, english: "Ribs", russian: "Ребра", description: "Кости грудной клетки" },
            { id: 7, english: "Humerus", russian: "Плечевая кость", description: "Кость верхней части руки" },
            { id: 8, english: "Radius", russian: "Лучевая кость", description: "Одна из костей предплечья" },
            { id: 9, english: "Ulna", russian: "Локтевая кость", description: "Вторая кость предплечья" },
            { id: 10, english: "Carpals", russian: "Кости запястья", description: "Мелкие кости запястья" },
            { id: 11, english: "Metacarpals", russian: "Пястные кости", description: "Кости ладони" },
            { id: 12, english: "Phalanges", russian: "Фаланги", description: "Кости пальцев" },
            { id: 13, english: "Pelvis", russian: "Таз", description: "Тазовые кости" },
            { id: 14, english: "Femur", russian: "Бедренная кость", description: "Самая длинная кость тела" },
            { id: 15, english: "Patella", russian: "Надколенник", description: "Коленная чашечка" },
            { id: 16, english: "Tibia", russian: "Большеберцовая кость", description: "Основная кость голени" },
            { id: 17, english: "Fibula", russian: "Малоберцовая кость", description: "Меньшая кость голени" },
            { id: 18, english: "Tarsals", russian: "Кости предплюсны", description: "Кости задней части стопы" },
            { id: 19, english: "Metatarsals", russian: "Плюсневые кости", description: "Кости средней части стопы" },
            { id: 20, english: "Vertebrae", russian: "Позвонки", description: "Кости позвоночника" }
        ];
    }

    initializeApp() {
        console.log('Initializing app...');
        this.setupEventListeners();
        this.displayCurrentBone(); // Показываем первую кость сразу
        this.populateBonesTable();
        this.showTab('learn');
        console.log('App initialized successfully');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
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
        
        console.log('Event listeners set up');
    }

    showTab(tabName) {
        console.log('Showing tab:', tabName);
        
        // Скрыть все вкладки
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Деактивировать все кнопки
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Показать выбранную вкладку
        const tabElement = document.getElementById(tabName);
        if (tabElement) {
            tabElement.classList.add('active');
        }

        // Активировать соответствующую кнопку
        const buttonElement = document.querySelector(`[data-tab="${tabName}"]`);
        if (buttonElement) {
            buttonElement.classList.add('active');
        }

        // Если выбрана викторина, начать новую
        if (tabName === 'quiz') {
            this.startQuiz();
        }
    }

    displayCurrentBone() {
        if (this.bones.length === 0) {
            console.error('No bones data available');
            return;
        }
        
        const bone = this.bones[this.currentBoneIndex];
        console.log('Displaying bone:', bone.english);
        
        document.getElementById('bone-name').textContent = bone.english;
        document.getElementById('bone-description').textContent = bone.description;
        document.getElementById('bone-translation').textContent = bone.russian;
    }

    populateBonesTable() {
        const tableBody = document.getElementById('bones-table');
        if (!tableBody) {
            console.error('Bones table not found');
            return;
        }
        
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

    startQuiz() {
        console.log('Starting quiz...');
        this.quizBones = [...this.bones].sort(() => Math.random() - 0.5);
        this.currentQuizIndex = 0;
        this.showQuizQuestion();
    }

    showQuizQuestion() {
        if (!this.quizBones || this.quizBones.length === 0) {
            console.error('No quiz questions available');
            return;
        }
        
        const bone = this.quizBones[this.currentQuizIndex];
        document.getElementById('quiz-russian').textContent = bone.russian;
        document.getElementById('answer-input').value = '';
        document.getElementById('quiz-feedback').textContent = '';
        document.getElementById('next-question').style.display = 'none';
        document.getElementById('submit-answer').style.display = 'block';
        
        // Фокус на input
        const answerInput = document.getElementById('answer-input');
        if (answerInput) {
            answerInput.focus();
        }
    }

    checkAnswer() {
        const answer = document.getElementById('answer-input').value.trim();
        if (!answer) {
            alert('Please enter an answer');
            return;
        }
        
        const bone = this.quizBones[this.currentQuizIndex];
        const feedback = document.getElementById('quiz-feedback');
        const isCorrect = bone.english.toLowerCase() === answer.toLowerCase();
        
        if (isCorrect) {
            feedback.textContent = '✅ Correct! Well done!';
            feedback.className = 'correct';
        } else {
            feedback.textContent = `❌ Incorrect. The correct answer is: ${bone.english}`;
            feedback.className = 'incorrect';
        }

        document.getElementById('submit-answer').style.display = 'none';
        document.getElementById('next-question').style.display = 'block';
    }

    nextQuizQuestion() {
        this.currentQuizIndex = (this.currentQuizIndex + 1) % this.quizBones.length;
        this.showQuizQuestion();
    }
}

// Запуск приложения
console.log('DOM content loaded');
document.addEventListener('DOMContentLoaded', () => {
    console.log('Creating BonesApp instance...');
    window.bonesApp = new BonesApp();
});

// Резервный запуск на случай если DOM уже загружен
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.bonesApp = new BonesApp();
    });
} else {
    window.bonesApp = new BonesApp();
}
