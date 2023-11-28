import numpy as np

# identity = np.array([
#     [ 0, 0, 0],
#     [ 0, 1, 0],
#     [ 0, 0, 0]
# ])

zeros3 = np.zeros((3, 3))

def box_blur(size):
	return np.full((size, size), fill_value=1/(size**2))

box_blur_3x3 = box_blur(3)
box_blur_5x5 = box_blur(5)
box_blur_7x7 = box_blur(7)

# sharpening filter
sharpen = np.array([
    [  0, -1,  0],
    [ -1,  5, -1],
    [  0, -1,  0]
])

edge_detection_1 = np.array([
    [  0, -1,  0],
    [ -1,  4, -1],
    [  0, -1,  0]
])

edge_detection_2 = np.array([
    [ -1, -1, -1],
    [ -1,  8, -1],
    [ -1, -1, -1]
])

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
