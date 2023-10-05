import base64
from io import BytesIO

import librosa
from matplotlib.figure import Figure

def load(cached_audio_file):
    return librosa.load(cached_audio_file)

def yyy(file):
    # audioName = 'trumpet'
    # filename = librosa.ex(audioName)
    y, sr = librosa.load(file)
    print_info(y)
    print(sr)

def print_info(ndarray):
    print('type: ', type(ndarray))
    print('ndim: ', ndarray.ndim) # num of dimensions (axes)
    print('shape: ', ndarray.shape)
    print('size: ', ndarray.size) # total num of elements
    print('dtype: ', ndarray.dtype) # type of elements
    print()

def get_info(ndarray):
    return (
        f" type: {type(ndarray)}\n"
        f" ndim: {ndarray.ndim}\n" # num of dimensions (axes)
        f"shape: {ndarray.shape}\n"
        f" size: {ndarray.size}\n" # total num of elements
        f"dtype: {ndarray.dtype}\n" # type of elements
    )

def get_image_data():
    # Generate the figure **without using pyplot**.
    fig = Figure()
    ax = fig.subplots()
    ax.plot([1, 2])
    # Save it to a temporary buffer.
    buf = BytesIO()
    fig.savefig(buf, format="png")
    # Embed the result in the html output.
    return base64.b64encode(buf.getbuffer()).decode("ascii")