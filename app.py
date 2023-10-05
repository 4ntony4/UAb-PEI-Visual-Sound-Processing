from flask import Flask, jsonify, make_response, render_template, request

import py.main as main

# import main # for replit use

app = Flask(__name__, template_folder='templates', static_folder='static')

cached_audio_file = None
cached_tuple = ()

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/cache_audio_file", methods=['POST'])
def cache_audio_file():
    if request.method == 'POST':
        try:
            global cached_audio_file, cached_tuple
            cached_audio_file = request.files['audio_file']
            cached_tuple = main.load(cached_audio_file)
            if cached_tuple != (): return jsonify(success=True)
            return make_response(jsonify(success=False), 500)
        except:
            return make_response(jsonify(success=False), 500)

@app.route("/start", methods=['POST'])
def start():
    if request.method == 'POST':
        global cached_tuple
        if cached_tuple != ():
            main.print_info(cached_tuple[0])
        return "hello"

@app.route("/example")
def example():
    data = main.get_image_data()
    return f"<img src='data:image/png;base64,{data}'/>"

app.run(host='0.0.0.0', port=81)
