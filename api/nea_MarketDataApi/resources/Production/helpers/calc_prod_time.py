def calc_prod_time(time, time_efficiency=0, facility_mod=1, runs=1, skill_mod=1):
    ## Based on formula from https://eve-industry.org/export/IndustryFormulas.pdf
    time_mod = ((100 - time_efficiency) / 100) * facility_mod
    prod_time = time * time_mod * skill_mod * runs
    return prod_time
