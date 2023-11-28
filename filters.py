import kernels
import padding
import main
import numpy as np

_name = 'name'
_code = 'code'
_kernel = 'kernel'

filter_dict_list = [
    {
        _name: 'Custom Kernel',
        _code: 'CKX',
        _kernel: kernels.identity_kernel().tolist()
    },
    {
        _name: 'Median',
        _code: 'MDN',
        _kernel: None
    },
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
        _name: 'Box Blur 3x3',
        _code: 'BB3',
        _kernel: kernels.box_blur_3x3.tolist()
    },
    {
        _name: 'Box Blur 5x5',
        _code: 'BB5',
        _kernel: kernels.box_blur_5x5.tolist()
    },
    {
        _name: 'Box Blur 7x7',
        _code: 'BB7',
        _kernel: kernels.box_blur_7x7.tolist()
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
            if item[_code] == 'MDN':
                D = main.stft(y)
                return median_filter(D)
            else:
                error_message = "Filter doesn't exist"
                raise Exception(error_message)
    else:
        error_message = "Filter doesn't exist"
        raise Exception(error_message)

def apply_custom_kernel(y, kernel):
    D = main.stft(y)
    return convolution_filter(D, np.array(kernel))

def get_kernel_from_code(code):
    for item in filter_dict_list:
        if item[_code] == code:
            return item
    return None

def neighborhood(matrix_2D,row,column,neighborhood_matrix_size=3):
    size = neighborhood_matrix_size

    if size % 2 == 0 or size < 3:
        error_message = "Argument size must be an odd number greater than or equal to 3"
        raise Exception(error_message)
    
    matrix = np.zeros((size, size), dtype=matrix_2D.dtype)
    offset = int(np.floor(size / 2))

    for i in range(size):
        for j in range(size):
            matrix[i, j] = matrix_2D[row + i - offset, column + j - offset]
    
    return matrix

def median_filter(matrix_2D, neighborhood_matrix_size=3, padding_mode='constant'):
    if padding_mode != 'constant':
        error_message = "Padding mode not implemented"
        raise Exception(error_message)
    
    n_padding_lines = int(np.floor(neighborhood_matrix_size / 2))

    padding_matrix = padding.add_constant(matrix_2D, padding_size=n_padding_lines, fill_value=0)
    
    rows, columns = (matrix_2D.shape[0], matrix_2D.shape[1])
    filtered_matrix = np.zeros((rows, columns), dtype=matrix_2D.dtype)
    
    ###
    for i in range (n_padding_lines, len(padding_matrix) - n_padding_lines):
        for j in range (n_padding_lines, len(padding_matrix[i]) - n_padding_lines):
            matrix_region = neighborhood(padding_matrix, i, j, neighborhood_matrix_size)
            filtered_matrix[i - n_padding_lines, j - n_padding_lines] = np.median(matrix_region)
    ###
    
    return filtered_matrix

def convolution_filter(matrix_2D, kernel, padding_mode='nearest'):
    if padding_mode != 'nearest':
        error_message = "Padding mode not implemented"
        raise Exception(error_message)
    
    n_padding_lines = int(np.floor(kernel.shape[0] / 2))

    padding_matrix = padding.add_nearest(matrix_2D, padding_size=n_padding_lines)
    
    rows, columns = (matrix_2D.shape[0], matrix_2D.shape[1])
    filtered_matrix = np.zeros((rows, columns), dtype=matrix_2D.dtype)
    
    ###
    for i in range (n_padding_lines, len(padding_matrix) - n_padding_lines):
        for j in range (n_padding_lines, len(padding_matrix[i]) - n_padding_lines):
            matrix_region = neighborhood(padding_matrix, i, j, kernel.shape[0])
            filtered_matrix[i - n_padding_lines, j - n_padding_lines] = convolve_2D(matrix_region, kernel)
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