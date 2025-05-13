document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup');
  
    document.querySelectorAll('.ingredient').forEach(item => {
      item.addEventListener('mouseover', e => {
        popup.textContent = item.dataset.info;
        popup.style.display = 'block';
        popup.style.left = e.pageX + 'px';
        popup.style.top = e.pageY + 'px';
      });
  
      item.addEventListener('mouseout', () => {
        popup.style.display = 'none';
      });
    });
  });
  