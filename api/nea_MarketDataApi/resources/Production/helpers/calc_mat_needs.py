from numpy import maximum, ceil

def calc_mat_needs(quantity, material_efficiency=0, facility_mod=1, runs=1):
    ## Based on formula from https://eve-industry.org/export/IndustryFormulas.pdf
    mat_mod = ((100 - material_efficiency) / 100) * facility_mod
    mat_need = maximum(runs, ceil(round(runs * quantity * mat_mod, 2)))\
        if runs >= 1\
        else maximum(1, ceil(round(quantity * mat_mod, 2))) * runs
    return mat_need
