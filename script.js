// =====================
// CBT SYSTEM SCRIPT
// =====================

let studentName = "";
let selectedSubject = "";
let questions = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 120; // 2 minutes
let timer;

// store selected answers
let userAnswers = [];

// SUBJECT COLLECTION
const subjects = { ict, mth, phy, chm };

// =====================
// SHUFFLE QUESTIONS
// =====================
function shuffleQuestions(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// =====================
// START EXAM
// =====================
function startExam() {
  const nameInput = document.getElementById("studentName").value.trim();
  const subjectInput = document.getElementById("subjectSelect").value;
  
  if (!nameInput) return alert("Please enter your name.");
  if (!subjectInput) return alert("Please select a subject.");
  
  studentName = nameInput;
  selectedSubject = subjectInput;
  
  questions = [...subjects[selectedSubject]];
  
  shuffleQuestions(questions); // randomize
  
  currentQuestion = 0;
  score = 0;
  timeLeft = 120;
  
  userAnswers = new Array(questions.length).fill(null);
  
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("examScreen").style.display = "block";
  
  generatePalette();
  showQuestion();
  startTimer();
}

// =====================
// SHOW QUESTION
// =====================
function showQuestion() {
  const q = questions[currentQuestion];
  const container = document.getElementById("questionContainer");
  
  container.innerHTML = `
        <h2>${currentQuestion + 1}. ${q.question}</h2>
        ${q.options.map((opt,index)=>`
            <button
                class="optionBtn ${userAnswers[currentQuestion]===index ? 'selected' : ''}"
                onclick="selectAnswer(${index})">
                ${index+1}. ${opt}
            </button>
        `).join("")}
    `;
  updateProgress();
}

// =====================
// SELECT ANSWER
// =====================
function selectAnswer(index) {
  userAnswers[currentQuestion] = index;
  updatePalette();
  showQuestion();
}

// =====================
// NEXT QUESTION
// =====================
function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  }
}

// =====================
// PREVIOUS QUESTION
// =====================
function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

// =====================
// QUESTION PALETTE
// =====================
function generatePalette() {
  const palette = document.getElementById("questionPalette");
  if (!palette) return;
  
  palette.innerHTML = "";
  for (let i = 0; i < questions.length; i++) {
    let btn = document.createElement("button");
    btn.innerText = i + 1;
    btn.onclick = () => {
      currentQuestion = i;
      showQuestion();
    };
    btn.id = "qbtn" + i;
    palette.appendChild(btn);
  }
}

// =====================
// UPDATE PALETTE COLOR
// =====================
function updatePalette() {
  for (let i = 0; i < userAnswers.length; i++) {
    const btn = document.getElementById("qbtn" + i);
    if (!btn) continue;
    if (userAnswers[i] !== null) {
      btn.style.background = "#4CAF50";
      btn.style.color = "white";
    }
  }
}

// =====================
// PROGRESS BAR
// =====================
function updateProgress() {
  const progress = document.getElementById("progress");
  if (!progress) return;
  let percent = ((currentQuestion + 1) / questions.length) * 100;
  progress.style.width = percent + "%";
}

// =====================
// TIMER
// =====================
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    
    const timerElement = document.getElementById("timer");
    timerElement.innerText = "Time: " + minutes + ":" + seconds;
    
    if (timeLeft <= 30) timerElement.style.color = "red";
    if (timeLeft <= 10) timerElement.classList.add("flash");
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitExam();
    }
  }, 1000);
}

// =====================
// SUBMIT EXAM
// =====================
function submitExam() {
  clearInterval(timer);
  score = 0;
  
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].answer) {
      score++;
    }
  }
  
  // save best score
  let bestScore = localStorage.getItem("bestScore") || 0;
  if (score > bestScore) {
    localStorage.setItem("bestScore", score);
  }
  
  document.getElementById("examScreen").style.display = "none";
  
  // SHOW RESULT POPUP
  document.getElementById("resultModal").style.display = "flex";
  
  const scoreDiv = document.getElementById("score");
  scoreDiv.innerHTML = `
        <h3>Candidate: ${studentName}</h3>
        <p>Subject: ${selectedSubject.toUpperCase()}</p>
        <h2>Score: ${score} / ${questions.length}</h2>
        <p>Best Score: ${localStorage.getItem("bestScore")}</p>
        <br>
        <button onclick="showReview()">Review Answers</button>
    `;
}

// =====================
// SHOW REVIEW
// =====================
function showReview() {
  document.getElementById("resultModal").style.display = "none";
  const review = document.getElementById("reviewScreen");
  review.style.display = "block";
  
  const container = document.getElementById("reviewContainer");
  container.innerHTML = "";
  
  questions.forEach((q, i) => {
    let user = userAnswers[i];
    let correct = q.answer;
    
    let div = document.createElement("div");
    div.classList.add("review-question");
    
    div.innerHTML = `
            <h3>Q${i+1}: ${q.question}</h3>
            <p class="review-answer ${user===correct?'correct':'wrong'}">
                Your Answer: ${user!==null?q.options[user]:'Not Answered'}
            </p>
            <p class="review-answer correct">
                Correct Answer: ${q.options[correct]}
            </p>
            ${q.explanation?`<p><em>Explanation: ${q.explanation}</em></p>`:""}
        `;
    
    container.appendChild(div);
  });
}

// =====================
// RESTART EXAM
// =====================
function restartExam() {
  location.reload();
}