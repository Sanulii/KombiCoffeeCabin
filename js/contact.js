document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('status-msg');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      statusMsg.style.display = 'block';
      form.reset();
    });
  }
});
