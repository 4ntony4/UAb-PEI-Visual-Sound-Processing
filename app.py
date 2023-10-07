from flask import Flask, jsonify, make_response, render_template, request

import py.main as m

app = Flask(__name__, template_folder='templates', static_folder='static')

cached_audio_file = None
cached_tuple = ()

def response_ok():
    return jsonify(success=True)

def response_error():
    return make_response(jsonify(success=False), 500)

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/cache_audio_file", methods=['POST'])
def cache_audio_file():
    if request.method == 'POST':
        try:
            global cached_audio_file, cached_tuple
            cached_audio_file = request.files['audio_file']
            cached_tuple = m.load(cached_audio_file)
            if cached_tuple != (): return response_ok()
            return response_error()
        except:
            return response_error()

@app.route("/start", methods=['POST'])
def start():
    if request.method == 'POST':
        try:
            global cached_tuple
            
            if len(request.data) == 0:
                if cached_tuple != ():
                    print(m.get_info_tuple(cached_tuple))

            else:
                cached_tuple = m.load(request.data.decode())
                print(m.get_info_tuple(cached_tuple))

            return response_ok()
        except:
            return response_error()

@app.route("/visualize_audio", methods=['POST'])
def visualize_audio():
    if request.method == 'POST':
        try:
            data = m.get_visualize_audio(cached_tuple)
            return f"data:image/png;base64,{data}"
        except:
            return response_error()

app.run(host='0.0.0.0', port=5500)
