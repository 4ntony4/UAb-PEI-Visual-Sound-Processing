import base64
import io

import librosa
import matplotlib
import matplotlib.pyplot as plt

matplotlib.use('agg')

def load(cached_audio_file, sr = 22050):
    return librosa.load(cached_audio_file, sr = sr)

def get_info_ndarray(ndarray):
    return (
        f" type: {type(ndarray)}\n"
        f" ndim: {ndarray.ndim}\n" # num of dimensions (axes)
        f"shape: {ndarray.shape}\n"
        f" size: {ndarray.size}\n" # total num of elements
        f"dtype: {ndarray.dtype}\n" # type of elements
    )

def get_info_tuple(t):
    return get_info_ndarray(t[0]) + f"   sr: {t[1]}"

def get_png_from_pyplot():
    # Save plot to a BytesIO object
    buf = io.BytesIO()
    plt.savefig(buf, format='png')

    # Convert BytesIO object to base64 string
    img_b64 = base64.b64encode(buf.getbuffer()).decode()

    return img_b64

def get_visualize_audio(t):
    plt.figure()
    librosa.display.waveshow(y = t[0], sr = t[1])
    plt.xlabel("Time (seconds)")
    plt.ylabel("Amplitude")

    return get_png_from_pyplot()
