// قائمة الرموز التعبيرية
const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

let gameBoard = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameActive = true;
let startTime = null;
let timerInterval = null;

// إنشاء لعبة جديدة
function initGame() {
    // إنشاء مصفوفة اللعبة (كل emoji مرتين)
    gameBoard = [...emojis, ...emojis];
    
    // خلط عشوائي
    gameBoard = gameBoard.sort(() => Math.random() - 0.5);
    
    // إعادة تعيين المتغيرات
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameActive = true;
    startTime = Date.now();
    
    // تحديث واجهة المستخدم
    document.getElementById('moves').textContent = moves;
    document.getElementById('matched').textContent = matchedPairs;
    
    // بدء المؤقت
    startTimer();
    
    // رسم لوحة اللعبة
    drawBoard();
}

// رسم لوحة اللعبة
function drawBoard() {
    const boardElement = document.getElementById('gameBoard');
    boardElement.innerHTML = '';
    
    gameBoard.forEach((emoji, index) => {
        const card = document.createElement('button');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.textContent = '?';
        card.addEventListener('click', () => flipCard(card, index));
        boardElement.appendChild(card);
    });
}

// قلب البطاقة
function flipCard(cardElement, index) {
    // التحقق من صحة الحركة
    if (!gameActive || flippedCards.length >= 2 || cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) {
        return;
    }
    
    // قلب البطاقة
    cardElement.classList.add('flipped');
    cardElement.textContent = gameBoard[index];
    flippedCards.push({ index, element: cardElement, emoji: gameBoard[index] });
    
    // إذا كانت هناك بطاقتان مقلوبتان
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        
        // التحقق من التطابق
        checkMatch();
    }
}

// التحقق من تطابق البطاقات
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.emoji === card2.emoji) {
        // تطابق!
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;
        document.getElementById('matched').textContent = matchedPairs;
        flippedCards = [];
        
        // التحقق من الفوز
        if (matchedPairs === emojis.length) {
            winGame();
        }
    } else {
        // عدم تطابق
        gameActive = false;
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card1.element.textContent = '?';
            card2.element.classList.remove('flipped');
            card2.element.textContent = '?';
            flippedCards = [];
            gameActive = true;
        }, 800);
    }
}

// بدء المؤقت
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timer').textContent = elapsed + 's';
    }, 1000);
}

// إيقاف المؤقت
function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

// الفوز باللعبة
function winGame() {
    gameActive = false;
    stopTimer();
    const time = document.getElementById('timer').textContent;
    alert(`🎉 تهانينا! لقد فزت!\n\nالمحاولات: ${moves}\nالوقت: ${time}`);
}

// إعادة تعيين اللعبة
function resetGame() {
    stopTimer();
    initGame();
}

// بدء اللعبة عند تحميل الصفحة
window.addEventListener('load', initGame);