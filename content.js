let hoveredImage = null;

document.addEventListener('mouseover', (event) => {
  if (event.target.tagName === 'IMG') {
    hoveredImage = event.target;
  }
});

document.addEventListener('mouseout', (event) => {
  if (event.target.tagName === 'IMG') {
    hoveredImage = null;
  }
});

document.addEventListener('keydown', (event) => {
  if (hoveredImage && (event.metaKey || event.ctrlKey) && event.key === 'c') {
    const imgTag = hoveredImage.outerHTML;
    navigator.clipboard.writeText(imgTag).then(() => {
      // Optional: Show a visual feedback
      const originalBorder = hoveredImage.style.border;
      hoveredImage.style.border = '2px solid #4CAF50';
      setTimeout(() => {
        hoveredImage.style.border = originalBorder;
      }, 500);
    }).catch(err => {
      console.error('Failed to copy image tag:', err);
    });
  }
}); 