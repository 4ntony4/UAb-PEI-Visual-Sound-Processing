import base64
import io

import IPython.display as ipd
import librosa
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
from werkzeug.datastructures import FileStorage

matplotlib.use('agg')
Pair = tuple[np.ndarray, float]

def load(cached_audio_file, sr=22050):
    if type(cached_audio_file) == str:
        with open(cached_audio_file, 'rb') as fp:
            f = FileStorage(fp)
            y, s_rate = librosa.load(f, sr=sr)
    else:
        y, s_rate = librosa.load(cached_audio_file, sr=sr)

    return y, s_rate

def get_info_ndarray(ndarray):
    return (
        f" type: {type(ndarray)}\n"
        f" ndim: {ndarray.ndim}\n" # num of dimensions (axes)
        f"shape: {ndarray.shape}\n"
        f" size: {ndarray.size}\n" # total num of elements
        f"dtype: {ndarray.dtype}\n" # type of elements
    )

def get_info_pair(pair: Pair):
    return get_info_ndarray(pair[0]) + f"\n   sr: {pair[1]}"

def get_png_from_pyplot():
    # Save plot to a BytesIO object
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    # Convert BytesIO object to base64 string
    img_b64 = base64.b64encode(buf.getbuffer()).decode()
    
    return img_b64

def waveshow(pair):
    title = "Waveform"
    if pair[0].ndim == 1:
        y = pair[0]
    elif pair[0].ndim == 2:
        title = "Filtered Waveform"
        y = istft(pair[0])
        
    else:
        raise Exception
    
    fig = plt.figure()
    librosa.display.waveshow(y=y, sr=pair[1])
    plt.suptitle(title, fontsize=16, y=0.965)
    plt.xlabel("Time (seconds)", fontsize=14)
    plt.ylabel("Amplitude", fontsize=14)
    
    plt.subplots_adjust(left=0.062, bottom=0.12, right=0.974, top=0.898)
    fig.set_figwidth(fig.get_figheight()*3)
    
    return get_png_from_pyplot()

# Short-time Fourier Transform (STFT)
def stft(y):
    return librosa.stft(y)

# Inverse Short-time Fourier Transform (ISTFT)
def istft(stft_matrix):
    return librosa.istft(stft_matrix)

# Convert an amplitude spectrogram to dB-scaled spectrogram.
def amplitude_to_db(D):
    return librosa.amplitude_to_db(np.abs(D), ref=np.max)

# Convert a dB-scaled spectrogram to an amplitude spectrogram.
def db_to_amplitude(S_db):
    return librosa.db_to_amplitude(S_db)

def specshow(y):
    title = "Spectrogram"
    if y.ndim == 1:
        S_db = amplitude_to_db(stft(y))
    elif y.ndim == 2:
        S_db = amplitude_to_db(y)
        title = "Filtered Spectrogram"
    else:
        raise Exception
    
    fig, ax = plt.subplots()
    img = librosa.display.specshow(S_db, x_axis='time', y_axis='linear', ax=ax)
    plt.suptitle(title, fontsize=16, y=0.955)
    plt.xlabel("Time (seconds)", fontsize=14)
    plt.ylabel("Frequency (Hz)", fontsize=14)
    fig.colorbar(img, ax=ax, format="%+2.f dB")
    plt.subplots_adjust(left=0.088, bottom=0.107, right=1.04, top=0.888)
    fig.set_figheight(5.4)
    fig.set_figwidth(11)

    return get_png_from_pyplot()

def get_wave_base64_from_ndarray(ndarray):
    val = ipd.Audio._make_wav(istft(ndarray), rate=22050, normalize=True)
    audio_data = base64.b64encode(val).decode()
    return audio_data