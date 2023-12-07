import numpy as np


def identity_kernel(size=3):
    if (size + 1) % 2 != 0:
        error_message = "Argument size must be an odd number"
        raise Exception(error_message)

    identity = np.zeros((size, size), np.int8)
    mid = int((size - 1) / 2)
    identity[mid,mid] = 1

    return identity

def box_blur(size):
    return np.full((size, size), fill_value=1/(size**2))

box_blur_3x3 = box_blur(3)
box_blur_5x5 = box_blur(5)
box_blur_7x7 = box_blur(7)

# smoothing linear filter
# weighted average linear filter
# (approximation)
gaussian_blur_3x3 = np.array([
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
]) * (1/16)

# smoothing linear filter
# weighted average linear filter
# (approximation)
gaussian_blur_5x5 = np.array([
    [1,  4,  6,  4, 1],
    [4, 16, 24, 16, 4],
    [6, 24, 36, 24, 6],
    [4, 16, 24, 16, 4],
    [1,  4,  6,  4, 1]
]) * (1/256)

# smoothing linear filter
# weighted average linear filter
# (approximation)
gaussian_blur_7x7 = np.array([
    [ 1,   6,  15,  20,  15,   6,  1],
    [ 6,  36,  90, 120,  90,  36,  6],
    [15,  90, 225, 300, 225,  90, 15],
    [20, 120, 300, 400, 300, 120, 20],
    [15,  90, 225, 300, 225,  90, 15],
    [ 6,  36,  90, 120,  90,  36,  6],
    [ 1,   6,  15,  20,  15,   6,  1]
]) * (1/4096)

# sharpening filter
laplacian_1 = np.array([
    [ 0,  1,  0],
    [ 1, -4,  1],
    [ 0,  1,  0]
])

# sharpening filter
laplacian_2 = np.array([
    [ 1,  1,  1],
    [ 1, -8,  1],
    [ 1,  1,  1]
])

# sharpening filter
laplacian_3 = np.array([
    [ -1,  2, -1],
    [  2, -4,  2],
    [ -1,  2, -1]
])

# sharpening filter
laplacian_4 = np.array([
    [  2, -1,  2],
    [ -1, -4, -1],
    [  2, -1,  2]
])

# sharpening filter
# gradient
sobel_vertical = np.array([
    [ -1,  0,  1],
    [ -2,  0,  2],
    [ -1,  0,  1]
])

# sharpening filter
# gradient
sobel_horizontal = np.array([
    [  1,  2,  1],
    [  0,  0,  0],
    [ -1, -2, -1]
])
