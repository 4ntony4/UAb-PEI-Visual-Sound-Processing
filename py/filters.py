import numpy as np
import json

sharpen_matrix = np.array([
                        [  0, -1,  0],
                        [ -1,  5, -1],
                        [  0, -1,  0]
                       ])

kernel_list = [
    {
        'name': 'Sharpen',
        'code': 'SH',
        'matrix': sharpen_matrix.tolist()
    },
    {
        'name': 'Gradient',
        'code': 'GR',
        'matrix': sharpen_matrix.tolist()
    }
]

def get_json_filter_list():
    return json.dumps(kernel_list)