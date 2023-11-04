from flask import Flask, jsonify, make_response, render_template, request

import py.main as main
import py.filters as filters

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
            cached_pair = main.load(cached_audio_file)
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
                    print(main.get_info_pair(cached_pair))

            else:
                cached_pair = main.load(request.data.decode())
                print(main.get_info_pair(cached_pair))

            return response_ok()
        except:
            return response_error()

@app.route("/waveshow", methods=['POST'])
def waveshow():
    if request.method == 'POST':
        try:
            data = main.waveshow(cached_pair)
            return f"data:image/png;base64,{data}"
        except:
            return response_error()

@app.route("/specshow", methods=['POST'])
def specshow():
    if request.method == 'POST':
        try:
            data = main.specshow(cached_pair)
            return f"data:image/png;base64,{data}"
        except:
            return response_error()

@app.route("/filter_list", methods=['GET'])
def get_filter_list():
    if request.method == 'GET':
        try:
            return filters.filter_dict_list
        except:
            return response_error()

@app.route("/apply_filter", methods=['POST'])
def apply_filter():
    if request.method == 'POST':
        try:
            filter_code = request.data.decode()
            result = filters.apply_filter(cached_pair[0], filter_code)

            # data = main.specshow(cached_pair)
            # return f"data:image/png;base64,{data}"
            return response_ok()
        except:
            return response_error()

app.run(host='0.0.0.0', port=5500, debug=True)
