from flask import Flask, render_template, request, send_file
from deep_translator import GoogleTranslator
from langdetect import detect, DetectorFactory
import io

DetectorFactory.seed = 0

app = Flask(__name__)

LANGUAGES = {
    'auto': 'Auto Detect', 'en': 'English', 'hi': 'Hindi', 'fr': 'French',
    'es': 'Spanish', 'de': 'German', 'ja': 'Japanese', 'zh-CN': 'Chinese',
    'kn': 'Kannada', 'ta': 'Tamil', 'te': 'Telugu', 'ar': 'Arabic',
    'ru': 'Russian', 'pt': 'Portuguese', 'it': 'Italian', 'ko': 'Korean'
}

FLAGS = {
    'auto': '🌐', 'en': '🇬🇧', 'hi': '🇮🇳', 'fr': '🇫🇷', 'es': '🇪🇸',
    'de': '🇩🇪', 'ja': '🇯🇵', 'zh-CN': '🇨🇳', 'kn': '🇮🇳', 'ta': '🇮🇳',
    'te': '🇮🇳', 'ar': '🇸🇦', 'ru': '🇷🇺', 'pt': '🇵🇹', 'it': '🇮🇹', 'ko': '🇰🇷'
}

VOICE_TAGS = {
    'en': 'en-US', 'hi': 'hi-IN', 'fr': 'fr-FR', 'es': 'es-ES',
    'de': 'de-DE', 'ja': 'ja-JP', 'zh-CN': 'zh-CN', 'kn': 'kn-IN',
    'ta': 'ta-IN', 'te': 'te-IN', 'ar': 'ar-SA', 'ru': 'ru-RU',
    'pt': 'pt-PT', 'it': 'it-IT', 'ko': 'ko-KR'
}

@app.route('/', methods=['GET', 'POST'])
def index():
    translated_text = ''
    source_text = ''
    source_lang = 'auto'
    target_lang = 'hi'
    detected_lang_name = ''

    if request.method == 'POST':
        source_text = request.form['source_text']
        source_lang = request.form['source_lang']
        target_lang = request.form['target_lang']

        if source_text.strip():
            translated_text = GoogleTranslator(source=source_lang, target=target_lang).translate(source_text)

            if source_lang == 'auto':
                try:
                    detected_code = detect(source_text)
                    detected_lang_name = LANGUAGES.get(detected_code, detected_code)
                except Exception:
                    detected_lang_name = ''

    return render_template('index.html', languages=LANGUAGES, flags=FLAGS, voice_tags=VOICE_TAGS,
                            source_text=source_text, translated_text=translated_text,
                            source_lang=source_lang, target_lang=target_lang,
                            detected_lang_name=detected_lang_name)

@app.route('/file-translate', methods=['GET', 'POST'])
def file_translate():
    translated_text = ''
    original_text = ''
    target_lang = 'hi'
    filename = ''

    if request.method == 'POST':
        target_lang = request.form['target_lang']
        file = request.files.get('file')
        if file and file.filename.endswith('.txt'):
            filename = file.filename
            original_text = file.read().decode('utf-8')
            if original_text.strip():
                translated_text = GoogleTranslator(source='auto', target=target_lang).translate(original_text)

    return render_template('file_translate.html', languages=LANGUAGES, flags=FLAGS,
                            translated_text=translated_text, original_text=original_text,
                            target_lang=target_lang, filename=filename)

@app.route('/download-translation', methods=['POST'])
def download_translation():
    text = request.form['translated_text']
    buffer = io.BytesIO()
    buffer.write(text.encode('utf-8'))
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name='translated.txt', mimetype='text/plain')

if __name__ == '__main__':
    app.run(debug=True)