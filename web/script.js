const previewBtn = document.getElementById('previewBtn');
const input = document.getElementById('docInput');
const list = document.getElementById('fileList');

previewBtn.addEventListener('click', () => {
  list.innerHTML = '';
  const files = Array.from(input.files || []);
  if (!files.length) {
    list.innerHTML = '<li>No files selected yet.</li>';
    return;
  }

  files.forEach((file) => {
    const li = document.createElement('li');
    li.textContent = `${file.name} — ${(file.size / 1024).toFixed(1)} KB`;
    list.appendChild(li);
  });
});
