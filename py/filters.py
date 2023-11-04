import py.kernels as k

filter_dict_list = [
    {
        'name': 'Sharpen',
        'code': 'SHP',
        'kernel': k.sharpen.tolist()
    },
    {
        'name': 'Edge Detection 1',
        'code': 'ED1',
        'kernel': k.edge_detection_1.tolist()
    },
    {
        'name': 'Edge Detection 2',
        'code': 'ED2',
        'kernel': k.edge_detection_2.tolist()
    },
    {
        'name': 'Gaussian Blur 3x3',
        'code': 'GB3',
        'kernel': k.gaussian_blur_3x3.tolist()
    },
    {
        'name': 'Gaussian Blur 5x5',
        'code': 'GB5',
        'kernel': k.gaussian_blur_5x5.tolist()
    },
    {
        'name': 'Gaussian Blur 7x7',
        'code': 'GB7',
        'kernel': k.gaussian_blur_7x7.tolist()
    },
    {
        'name': 'Laplacian 1',
        'code': 'LP1',
        'kernel': k.laplacian_1.tolist()
    },
    {
        'name': 'Laplacian 2',
        'code': 'LP2',
        'kernel': k.laplacian_2.tolist()
    },
    {
        'name': 'Laplacian 3',
        'code': 'LP3',
        'kernel': k.laplacian_3.tolist()
    },
    {
        'name': 'Laplacian 4',
        'code': 'LP4',
        'kernel': k.laplacian_4.tolist()
    },
    {
        'name': 'Sobel Vertical',
        'code': 'SBV',
        'kernel': k.sobel_vertical.tolist()
    },
    {
        'name': 'Sobel Horizontal',
        'code': 'SBH',
        'kernel': k.sobel_horizontal.tolist()
    }
]
