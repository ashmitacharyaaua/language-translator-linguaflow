# 🌐 LinguaFlow — AI-Powered Language Translator

A full-stack web app that translates text and files between 15+ languages in real time, with voice input, voice output, and a polished, modern UI.

Built as part of an AI/ML project portfolio (Task 1: Language Translation Tool).

## ✨ Features

- **Auto-detect language** — just type, no need to select the source language
- **Text-to-speech** — hear the translation spoken aloud
- **Speech-to-text** — speak instead of typing
- **File translation** — upload a `.txt` file and download the fully translated version
- **Translation history** — revisit and reuse your last 10 translations (saved locally in-browser)
- **Quick phrase chips** — one-tap common phrases like "Thank you" or "Where is the bathroom?"
- **Dark mode**
- **Command palette (Ctrl+K)** — jump straight to any target language
- **Swap languages** with one click
- **Copy to clipboard**

## 🛠️ Tech Stack

- **Backend:** Python, Flask
- **Translation engine:** [deep-translator](https://github.com/nidhaloff/deep-translator) (Google Translate, no API key required)
- **Language detection:** langdetect
- **Frontend:** HTML, CSS, vanilla JavaScript
- **Browser APIs:** Web Speech API (speech recognition + speech synthesis)

## 🚀 Running Locally

1. Clone the repo: git clone https://github.com/ashmitacharyaaua/language-translator-linguaflow.git
cd language-translator-linguaflow

2. Install dependencies: pip install flask deep-translator langdetect

3.  Run the app: pythonapp.py

4. Open `http://127.0.0.1:5000` in your browser.

## 📁 Project Structure  
 translator_project/
├── app.py
├── static/
│ ├── style.css
│ └── main.js
└── templates/
├── index.html
└── file_translate.html

## 🔮 Possible Future Additions

- Support for more file types (.docx, .pdf)
- User accounts with persistent history
- Deployment to a live URL

---

Built by [Ashmit U Acharya](https://github.com/ashmitacharyaaua)
      
