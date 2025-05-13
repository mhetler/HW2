document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = btn.nextElementSibling;
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
      });
    });
  });
  