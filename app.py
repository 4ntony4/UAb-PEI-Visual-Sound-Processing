import io
import random

import librosa
from flask import Flask, Response, render_template
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure

# import IPython.display as ipd

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route("/")
def home():
    return render_template('index.html')

def yyy():
    audioName = 'trumpet'
    filename = librosa.ex(audioName)
    y, sr = librosa.load(filename)
    # ipd.Audio(y, rate=sr)
    return y

def printInfo(ndarray):
    print('type: ', type(ndarray))
    print('ndim: ', ndarray.ndim) # num of dimensions (axes)
    print('shape: ', ndarray.shape)
    print('size: ', ndarray.size) # total num of elements
    print('dtype: ', ndarray.dtype) # type of elements
    print()

@app.route("/example")
def example():
    printInfo(yyy())
    return 'hello'


@app.route('/plot.png')
def plot_png():
    fig = create_figure()
    output = io.BytesIO()
    FigureCanvas(fig).print_png(output)
    return Response(output.getvalue(), mimetype='image/png')

def create_figure():
    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)
    xs = range(100)
    ys = [random.randint(1, 50) for x in xs]
    axis.plot(xs, ys)
    return fig


app.run(host='0.0.0.0', port=81)