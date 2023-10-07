from flask import Flask, jsonify, make_response, render_template, request

import py.main as m

app = Flask(__name__, template_folder='templates', static_folder='static')

cached_audio_file = None

# Pair = tuple[numpy.ndarray, float]
cached_pair = ()

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
            global cached_audio_file, cached_pair
            cached_audio_file = request.files['audio_file']
            cached_pair = m.load(cached_audio_file)
            if cached_pair != (): return response_ok()
            return response_error()
        except:
            return response_error()

@app.route("/start", methods=['POST'])
def start():
    if request.method == 'POST':
        try:
            global cached_pair
            
            if len(request.data) == 0:
                if cached_pair != ():
                    print(m.get_info_pair(cached_pair))

            else:
                cached_pair = m.load(request.data.decode())
                print(m.get_info_pair(cached_pair))

            return response_ok()
        except:
            return response_error()

@app.route("/waveshow", methods=['POST'])
def waveshow():
    if request.method == 'POST':
        try:
            data = m.waveshow(cached_pair)
            return f"data:image/png;base64,{data}"
        except:
            return response_error()

app.run(host='0.0.0.0', port=5500)
