import numpy as np


def add_constant(matrix_2D, padding_size=1, fill_value=0):
    if padding_size < 1:
        error_message = "Argument padding_size must be an integer greater than or equal to 1"
        raise Exception(error_message)
    
    new_matrix = matrix_2D

    for _ in range(padding_size):
        rows = new_matrix.shape[0]
        padding_x = np.full((rows, 1), fill_value, dtype=new_matrix.dtype)
        new_matrix = np.concatenate([padding_x, new_matrix, padding_x], axis=1)
        
        columns = new_matrix.shape[1]
        padding_y = np.full((1, columns), fill_value, dtype=new_matrix.dtype)
        new_matrix = np.concatenate([padding_y, new_matrix, padding_y], axis=0)
    
    return new_matrix

def add_nearest(matrix_2D, padding_size=1):
    if padding_size < 1:
        error_message = "Argument padding_size must be an integer greater than or equal to 1"
        raise Exception(error_message)
    
    new_matrix = matrix_2D

    for _ in range(padding_size):
        rows = new_matrix.shape[0]
        
        padding_left = np.zeros((rows, 1), dtype=new_matrix.dtype)
        for i in range(rows):
            padding_left[i] = new_matrix[i,0]
            
        padding_right = np.zeros((rows, 1), dtype=new_matrix.dtype)
        for i in range(rows):
            padding_right[i] = new_matrix[i,-1]
            
        new_matrix = np.concatenate([padding_left, new_matrix, padding_right], axis=1)
        
        columns = new_matrix.shape[1]
        
        padding_top = np.zeros((1, columns), dtype=new_matrix.dtype)
        for i in range(columns):
            padding_top[0,i] = new_matrix[0,i]
            
        padding_bottom = np.zeros((1, columns), dtype=new_matrix.dtype)
        for i in range(columns):
            padding_bottom[-1,i] = new_matrix[-1,i]
            
        new_matrix = np.concatenate([padding_top, new_matrix, padding_bottom], axis=0)
    
    return new_matrix