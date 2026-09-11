document.addEventListener('DOMContentLoaded', () => {
  const siteHeader = document.getElementById('siteHeader');
  const updateHeaderState = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  const pills = Array.from(document.querySelectorAll('.quiz-pill'));
  const quizPills = document.getElementById('quizPills');
  const showFormButton = document.getElementById('showFormButton');
  const formWrapper = document.getElementById('formWrapper');

  function updateButtonVisibility() {
    const anyActive = pills.some((pill) => pill.classList.contains('active'));
    showFormButton.classList.toggle('hidden', !anyActive);
  }

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
      updateButtonVisibility();
    });
  });

  showFormButton.addEventListener('click', () => {
    quizPills.classList.add('hidden');
    showFormButton.classList.add('hidden');
    formWrapper.classList.remove('hidden');
    requestAnimationFrame(() => {
      formWrapper.classList.add('visible');
    });
  });
});
