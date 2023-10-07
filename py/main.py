import base64
import io

import librosa
import matplotlib
import matplotlib.pyplot as plt
import numpy as np

matplotlib.use('agg')
Pair = tuple[np.ndarray, float]

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

def get_info_pair(pair: Pair):
    return get_info_ndarray(pair[0]) + f"\n   sr: {pair[1]}"

def get_png_from_pyplot():
    # Save plot to a BytesIO object
    buf = io.BytesIO()
    plt.savefig(buf, format='png')

    # Convert BytesIO object to base64 string
    img_b64 = base64.b64encode(buf.getbuffer()).decode()

    return img_b64

def waveshow(pair):
    plt.figure()
    librosa.display.waveshow(y = pair[0], sr = pair[1])
    plt.xlabel("Time (seconds)")
    plt.ylabel("Amplitude")

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
    D = stft(y)
    S_db = amplitude_to_db(D)

    fig, ax = plt.subplots()
    img = librosa.display.specshow(S_db, x_axis='time', y_axis='linear', ax=ax)
    ax.set(title='Spectrogram')
    fig.colorbar(img, ax=ax, format="%+2.f dB")

    return get_png_from_pyplot()