def order_processes(processes):
    processes = [
        *sorted([process for process in processes
         if process['blueprint']['bp_type'] in ['original', 'relic']],
               key=lambda x: x['efficiency_ratio'], reverse=True),
        *sorted([process for process in processes
         if process['blueprint']['bp_type'] not in ['original', 'relic']],
               key=lambda x: x['efficiency_ratio'], reverse=True),
    ]
    return processes
