document.addEventListener('DOMContentLoaded', () => {
  const questions = Array.from(document.querySelectorAll('.quiz-question'));
  const progressFill = document.getElementById('progressFill');
  const nextButton = document.getElementById('nextButton');
  const quizQuestions = document.getElementById('quizQuestions');
  const quizResult = document.getElementById('quizResult');
  const resultBanner = document.getElementById('resultBanner');
  const resultText = document.getElementById('resultText');
  const quizIframeWrapper = document.getElementById('quizIframeWrapper');

  const totalQuestions = questions.length;
  let currentIndex = 0;
  let totalScore = 0;
  let answered = false;

  const tiers = [
    {
      max: 3,
      className: 'tier-green',
      text: 'Équipe en bonne posture — consolidez avec une session GetUp'
    },
    {
      max: 6,
      className: 'tier-orange',
      text: 'Situation fragile — le bon moment pour agir'
    },
    {
      max: Infinity,
      className: 'tier-red',
      text: "Résistance active — urgence d'intervenir"
    }
  ];

  function updateProgress() {
    const percent = ((currentIndex + 1) / totalQuestions) * 100;
    progressFill.style.width = percent + '%';
  }

  function updateNextButtonLabel() {
    nextButton.textContent = currentIndex === totalQuestions - 1
      ? 'Voir mon diagnostic →'
      : 'Question suivante →';
  }

  function showQuestion(index) {
    questions.forEach((question, i) => {
      question.classList.toggle('hidden', i !== index);
    });
    updateProgress();
    updateNextButtonLabel();
  }

  function selectOption(question, button) {
    question.querySelectorAll('.quiz-option').forEach((option) => {
      option.classList.remove('selected');
    });
    button.classList.add('selected');
    question.dataset.selectedScore = button.dataset.score;
    answered = true;
    nextButton.disabled = false;
  }

  function getTier(score) {
    return tiers.find((tier) => score <= tier.max);
  }

  function showResult() {
    quizQuestions.classList.add('hidden');
    document.querySelector('.progress-bar').classList.add('hidden');
    nextButton.classList.add('hidden');

    const tier = getTier(totalScore);
    tiers.forEach((t) => resultBanner.classList.remove(t.className));
    resultBanner.classList.add(tier.className);
    resultText.textContent = tier.text;

    quizResult.classList.remove('hidden');
    quizIframeWrapper.classList.remove('hidden');
  }

  questions.forEach((question) => {
    question.querySelectorAll('.quiz-option').forEach((button) => {
      button.addEventListener('click', () => selectOption(question, button));
    });
  });

  nextButton.addEventListener('click', () => {
    if (!answered) return;

    const currentQuestion = questions[currentIndex];
    totalScore += Number(currentQuestion.dataset.selectedScore);

    if (currentIndex === totalQuestions - 1) {
      showResult();
      return;
    }

    currentIndex += 1;
    answered = Boolean(questions[currentIndex].dataset.selectedScore);
    nextButton.disabled = !answered;
    showQuestion(currentIndex);
  });

  showQuestion(currentIndex);
});
