import numpy as np

# padding_size = 1

def add_constant(matrix_2D, fill_value=0):
    rows = matrix_2D.shape[0]
    padding_x = np.full((rows, 1), fill_value, dtype=matrix_2D.dtype)
    new_matrix = np.concatenate([padding_x, matrix_2D, padding_x], axis=1)
    
    columns = new_matrix.shape[1]
    padding_y = np.full((1, columns), fill_value, dtype=new_matrix.dtype)
    new_matrix = np.concatenate([padding_y, new_matrix, padding_y], axis=0)
    
    return new_matrix

def add_reflect(matrix_2D):
    rows = matrix_2D.shape[0]
    
    padding_left = np.zeros((rows, 1), dtype=matrix_2D.dtype)
    for i in range(rows):
        padding_left[i] = matrix_2D[i,0]
        
    padding_right = np.zeros((rows, 1), dtype=matrix_2D.dtype)
    for i in range(rows):
        padding_right[i] = matrix_2D[i,-1]
        
    new_matrix = np.concatenate([padding_left, matrix_2D, padding_right], axis=1)
    
    columns = new_matrix.shape[1]
    
    padding_top = np.zeros((1, columns), dtype=new_matrix.dtype)
    for i in range(columns):
        padding_top[0,i] = new_matrix[0,i]
        
    padding_bottom = np.zeros((1, columns), dtype=new_matrix.dtype)
    for i in range(columns):
        padding_bottom[-1,i] = new_matrix[-1,i]
        
    new_matrix = np.concatenate([padding_top, new_matrix, padding_bottom], axis=0)
    
    return new_matrix