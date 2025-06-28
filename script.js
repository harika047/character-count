const textArea = document.getElementById('inputText');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const sentenceCount = document.getElementById('sentenceCount');
const excludeSpaces = document.getElementById('excludeSpaces');
const setLimit = document.getElementById('setLimit');
const readTime = document.getElementById('readTime');
const letterDensity = document.getElementById('letterDensity');
const toggleBtn = document.querySelector('.theme-toggle');
const warning = document.getElementById('warning');

function updateStats() {
    const maxLimit = 300;
    const applyLimit = setLimit.checked;
    let text = textArea.value;

    if (applyLimit) {
        if (excludeSpaces.checked) {
            let count = 0;
            let trimmedText = '';
            for (let char of text) {
                if (char !== ' ') count++;
                if (count > maxLimit) break;
                trimmedText += char;
            }
            text = trimmedText;
        } else {
            if (text.length > maxLimit) {
                text = text.slice(0, maxLimit);
            }
        }
    }

    if (text !== textArea.value) {
        textArea.value = text;
    }

    const totalChars = excludeSpaces.checked ? text.replace(/\s/g, '').length : text.length;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const readMins = Math.ceil(words.length / 200);

    charCount.textContent = totalChars.toString().padStart(2, '0');
    wordCount.textContent = words.length.toString().padStart(2, '0');
    sentenceCount.textContent = sentences.length.toString().padStart(2, '0');
    readTime.textContent = `Approx. reading time: ${readMins < 1 ? '<1' : readMins} minute${readMins !== 1 ? 's' : ''}`;

    const hasNumber = /\d/.test(text);
    const exceedsLimit = applyLimit && totalChars >= maxLimit;

    if (hasNumber || exceedsLimit) {
        warning.style.display = 'block';
        warning.innerHTML = '';
        if (hasNumber) {
            warning.innerHTML += '❗ Please enter only characters.<br>';
        }
        if (exceedsLimit) {
            warning.innerHTML += `⚠️ Character limit reached! (Max: ${maxLimit})`;
        }
    } else {
        warning.style.display = 'none';
        warning.innerHTML = '';
    }

    const freq = {};
    for (let char of text.toUpperCase()) {
        if (/[A-Z]/.test(char)) {
            freq[char] = (freq[char] || 0) + 1;
        }
    }

    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const totalLetters = Object.values(freq).reduce((a, b) => a + b, 0);

    letterDensity.innerHTML = '';
    sorted.forEach(([letter, count]) => {
        const percent = ((count / totalLetters) * 100).toFixed(2);
        letterDensity.innerHTML += `
            <div class="bar">
                <span>${letter}</span>
                <div class="progress">
                    <div class="progress-inner" style="width: ${percent}%"></div>
                </div>
                <span>${count} (${percent}%)</span>
            </div>
        `;
    });
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    toggleBtn.textContent = isLight ? '🌙' : '☀️';
}
const saveBtn = document.getElementById('saveBtn');

saveBtn.addEventListener('click', () => {
    const content = textArea.value.trim(); 

    if (content.length === 0) {
        warning.style.display = 'block';
        warning.innerHTML = '✏️ Please write something before saving!';
        return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = 'text.txt';
    link.href = URL.createObjectURL(blob);
    link.click();
});

toggleBtn.addEventListener('click', toggleTheme);
textArea.addEventListener('input', updateStats);
excludeSpaces.addEventListener('change', updateStats);
setLimit.addEventListener('change', updateStats);
