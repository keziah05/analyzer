import pandas as pd

def form_balanced_teams(developers_data: list) -> list:
    """
    Forms balanced developer teams from a dataset based on roles and anomaly status.
    
    Expected format per developer dictionary requires 'analysis' nested dict.
    """
    if not developers_data:
        return []
        
    # flatten the data for pandas
    flat_data = []
    for d in developers_data:
        # Skip developers that haven't been analyzed
        if 'analysis' not in d or not d['analysis']:
            continue
            
        flat_data.append({
            'Developer_ID': d.get('name', str(d.get('_id', 'Unknown'))),
            'Role': d['analysis'].get('type', 'Unknown'),
            'Anomaly status': 'Anomaly' if d['analysis'].get('is_anomaly') else 'Normal'
        })
        
    df = pd.DataFrame(flat_data)
    if df.empty:
        return []
        
    teams = []
    
    # Define the required roles for a balanced team
    required_roles = [
        'Rapid Coder', 
        'Debug Specialist', 
        'Refactor Specialist', 
        'Deep Worker'
    ]
    
    # Group developers by Anomaly status
    for status, group_df in df.groupby('Anomaly status'):
        
        # Separate developers into lists based on their roles
        role_pools = {
            role: group_df[group_df['Role'] == role]['Developer_ID'].tolist() 
            for role in required_roles
        }
        
        # Determine the maximum number of teams we can form
        max_possible_teams = min(len(developers) for list_of_devs in role_pools.values() for developers in [list_of_devs])
        
        # Form the teams by taking one developer from each role
        for i in range(max_possible_teams):
            team = {
                'Anomaly_status': status,
                'Members': {role: role_pools[role][i] for role in required_roles}
            }
            teams.append(team)
            
            # Print each team with its anomaly status as requested
            print(f"=== Team formed (Status: {status}) ===")
            for role in required_roles:
                print(f"{role}: {team['Members'][role]}")
            print()
            
    return teams
