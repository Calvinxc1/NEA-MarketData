from numpy import maximum, ceil

def calc_mat_needs(base_quantity, runs, material_efficiency, facility_mod=1):
    material_mod = facility_mod * ((100-material_efficiency)/100)
    mat_needs = maximum(1, ceil((base_quantity * material_mod).round(2))) * runs
    return mat_needs
