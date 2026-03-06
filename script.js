// =====================
// MAIN.JS - CBT SYSTEM
// =====================

let studentName = "";
let selectedSubject = "";
let questions = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 300; // 5 minutes default
let timer;

// SUBJECTS COLLECTION
const subjects = { ict, mth, phy, chm };

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
  questions = subjects[selectedSubject];
  currentQuestion = 0;
  score = 0;
  timeLeft = 300;
  
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("examScreen").style.display = "block";
  
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
        ${q.options.map((opt,index) => `<button onclick="selectAnswer(${index})">${index+1}. ${opt}</button>`).join("")}
    `;
}

// =====================
// SELECT ANSWER
// =====================
function selectAnswer(index) {
  if (index === questions[currentQuestion].answer) score++;
}

// =====================
// NAVIGATION
// =====================
function nextQuestion() {
  if (currentQuestion < questions.length - 1) currentQuestion++, showQuestion();
}

function previousQuestion() {
  if (currentQuestion > 0) currentQuestion--, showQuestion();
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
    
    if (timeLeft <= 60) timerElement.style.color = "red";
    if (timeLeft <= 10) timerElement.classList.add("flash");
    if (timeLeft <= 0) clearInterval(timer), submitExam();
  }, 1000);
}

// =====================
// SUBMIT EXAM
// =====================
function submitExam() {
  clearInterval(timer);
  document.getElementById("examScreen").style.display = "none";
  document.getElementById("resultScreen").style.display = "block";
  document.getElementById("score").innerHTML = `
        Candidate: <strong>${studentName}</strong><br>
        Subject: <strong>${selectedSubject.toUpperCase()}</strong><br><br>
        Score: ${score} / ${questions.length}
    `;
}