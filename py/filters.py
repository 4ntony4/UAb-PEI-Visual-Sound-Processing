import py.kernels as k

_name = 'name'
_code = 'code'
_kernel = 'kernel'

filter_dict_list = [
    {
        _name: 'Sharpen',
        _code: 'SHP',
        _kernel: k.sharpen.tolist()
    },
    {
        _name: 'Edge Detection 1',
        _code: 'ED1',
        _kernel: k.edge_detection_1.tolist()
    },
    {
        _name: 'Edge Detection 2',
        _code: 'ED2',
        _kernel: k.edge_detection_2.tolist()
    },
    {
        _name: 'Gaussian Blur 3x3',
        _code: 'GB3',
        _kernel: k.gaussian_blur_3x3.tolist()
    },
    {
        _name: 'Gaussian Blur 5x5',
        _code: 'GB5',
        _kernel: k.gaussian_blur_5x5.tolist()
    },
    {
        _name: 'Gaussian Blur 7x7',
        _code: 'GB7',
        _kernel: k.gaussian_blur_7x7.tolist()
    },
    {
        _name: 'Laplacian 1',
        _code: 'LP1',
        _kernel: k.laplacian_1.tolist()
    },
    {
        _name: 'Laplacian 2',
        _code: 'LP2',
        _kernel: k.laplacian_2.tolist()
    },
    {
        _name: 'Laplacian 3',
        _code: 'LP3',
        _kernel: k.laplacian_3.tolist()
    },
    {
        _name: 'Laplacian 4',
        _code: 'LP4',
        _kernel: k.laplacian_4.tolist()
    },
    {
        _name: 'Sobel Vertical',
        _code: 'SBV',
        _kernel: k.sobel_vertical.tolist()
    },
    {
        _name: 'Sobel Horizontal',
        _code: 'SBH',
        _kernel: k.sobel_horizontal.tolist()
    }
]

def apply_filter(y, code):
    item = get_kernel_from_code(code)
    if item:
        if item[_kernel]:
            print(item[_kernel])
        else:
            # kernel doesn't exist
            print('Kernel doesn\'t exist')
    else:
        # filter doesn't exist
        print('Filter doesn\'t exist')
    
    return 0

def get_kernel_from_code(code):
    for item in filter_dict_list:
        if item[_code] == code:
            return item
    return None