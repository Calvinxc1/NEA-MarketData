def calc_invent_chance(probability, encrypt_level=0, datacore_levels=(0,0), decrypt_mod=1):
    ## Based on formula from https://eve-industry.org/export/IndustryFormulas.pdf
    skill_mod = 1 + (encrypt_level/40) + (sum(datacore_levels)/30)
    invent_chance = min(1, probability * skill_mod * decrypt_mod)
    return invent_chance
