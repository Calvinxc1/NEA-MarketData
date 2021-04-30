from numpy import maximum, ceil
def calc_mat_needs(quantity, material_efficiency=0, runs=1):
    ## Based on formula from https://eve-industry.org/export/IndustryFormulas.pdf
    mat_mod = (100 - material_efficiency) / 100
    mat_need = maximum(runs, ceil(round(runs * quantity * mat_mod, 2)))
    return mat_need
