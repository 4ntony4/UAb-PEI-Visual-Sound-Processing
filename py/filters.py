import py.kernels as kernels
import py.padding as padding
import py.main as main
import numpy as np

_name = 'name'
_code = 'code'
_kernel = 'kernel'

filter_dict_list = [
    {
        _name: 'Sharpen',
        _code: 'SHP',
        _kernel: kernels.sharpen.tolist()
    },
    {
        _name: 'Edge Detection 1',
        _code: 'ED1',
        _kernel: kernels.edge_detection_1.tolist()
    },
    {
        _name: 'Edge Detection 2',
        _code: 'ED2',
        _kernel: kernels.edge_detection_2.tolist()
    },
    {
        _name: 'Gaussian Blur 3x3',
        _code: 'GB3',
        _kernel: kernels.gaussian_blur_3x3.tolist()
    },
    {
        _name: 'Gaussian Blur 5x5',
        _code: 'GB5',
        _kernel: kernels.gaussian_blur_5x5.tolist()
    },
    {
        _name: 'Gaussian Blur 7x7',
        _code: 'GB7',
        _kernel: kernels.gaussian_blur_7x7.tolist()
    },
    {
        _name: 'Laplacian 1',
        _code: 'LP1',
        _kernel: kernels.laplacian_1.tolist()
    },
    {
        _name: 'Laplacian 2',
        _code: 'LP2',
        _kernel: kernels.laplacian_2.tolist()
    },
    {
        _name: 'Laplacian 3',
        _code: 'LP3',
        _kernel: kernels.laplacian_3.tolist()
    },
    {
        _name: 'Laplacian 4',
        _code: 'LP4',
        _kernel: kernels.laplacian_4.tolist()
    },
    {
        _name: 'Sobel Vertical',
        _code: 'SBV',
        _kernel: kernels.sobel_vertical.tolist()
    },
    {
        _name: 'Sobel Horizontal',
        _code: 'SBH',
        _kernel: kernels.sobel_horizontal.tolist()
    }
]

def apply_filter(y, code):
    item = get_kernel_from_code(code)
    if item:
        if item[_kernel]:
            D = main.stft(y)
            return convolution_filter(D, np.array(item[_kernel]))
        else:
            error_message = "Kernel doesn't exist"
            print(error_message)
            raise Exception
    else:
        error_message = "Filter doesn't exist"
        print(error_message)
        raise Exception
    
    return 0

def get_kernel_from_code(code):
    for item in filter_dict_list:
        if item[_code] == code:
            return item
    return None

def neighborhood_3x3(matrix_2D,i,j):
    return np.array([
        [matrix_2D[i-1,j-1], matrix_2D[i-1,j], matrix_2D[i-1,j+1]],
        [matrix_2D[i,j-1], matrix_2D[i,j], matrix_2D[i,j+1]],
        [matrix_2D[i+1,j-1], matrix_2D[i+1,j], matrix_2D[i+1,j+1]],
        ], dtype=matrix_2D.dtype)

def median_filter(matrix_2D, padding_mode='constant'):
    if padding_mode != 'constant':
        error_message = "Padding mode not implemented"
        print(error_message)
        raise Exception
    
    padding_matrix = padding.add_constant(matrix_2D)

    rows, columns = (matrix_2D.shape[0], matrix_2D.shape[1])
    filtered_matrix = np.zeros((rows, columns), dtype=matrix_2D.dtype)

    n_padding = 1

    ###
    for i in range (n_padding, len(padding_matrix) - n_padding):
        for j in range (n_padding, len(padding_matrix[i]) - n_padding):
            matrix_region = neighborhood_3x3(padding_matrix,i,j)
            filtered_matrix[i-n_padding, j-n_padding] = np.median(matrix_region)
    ###

    return filtered_matrix

def convolution_filter(matrix_2D, kernel, padding_mode='reflect'):
    if padding_mode != 'reflect':
        error_message = "Padding mode not implemented"
        print(error_message)
        raise Exception
    
    padding_matrix = padding.add_reflect(matrix_2D)

    rows, columns = (matrix_2D.shape[0], matrix_2D.shape[1])
    filtered_matrix = np.zeros((rows, columns), dtype=matrix_2D.dtype)

    n_padding = 1

    ###
    for i in range (n_padding, len(padding_matrix) - n_padding):
        for j in range (n_padding, len(padding_matrix[i]) - n_padding):
            matrix_region = neighborhood_3x3(padding_matrix,i,j)
            filtered_matrix[i-n_padding, j-n_padding] = convolve_2D(matrix_region, kernel)
    ###

    return filtered_matrix

# 2D Convolution
def convolve_2D(matrix_a, matrix_b):
    if matrix_a.shape != matrix_b.shape:
        error_message = "Shape of matrices must be equal"
        print(error_message)
        raise Exception

    m = matrix_a.shape[0] # rows
    n = matrix_a.shape[1] # columns

    result = 0

    ###
    for i in range(m):
        for j in range(n):
            # print(i,j) #debug
            # print(matrix_a[m - i - 1, n - j - 1], ".", matrix_b[i, j]) #debug
            result += matrix_a[m - i - 1, n - j - 1] * matrix_b[i, j]
    ###

    return result