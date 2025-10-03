import random
from typing import Dict
from denominations import USD_DENOMINATIONS

def calculate_change(owed: float, paid: float, denominations: Dict[str, int], 
                    random_divisor: int = None) -> Dict[str, int]:
    """
    Calculate change to return to customer.
    
    Args:
        owed: Amount owed by customer
        paid: Amount paid by customer  
        denominations: Dictionary mapping coin names to values in cents
        random_divisor: If owed amount is divisible by this number, use random denominations
        
    Returns:
        Dictionary mapping coin names to counts
    """
    # Convert to cents to avoid floating point errors
    owed_cents = round(owed * 100)
    paid_cents = round(paid * 100)
    change_cents = paid_cents - owed_cents
    
    if change_cents <= 0:
        return {}
    
    # Check if we should use random denominations (based on owed amount)
    use_random = random_divisor is not None and owed_cents % random_divisor == 0
    
    if use_random:
        return _generate_random_change(change_cents, denominations)
    else:
        return _calculate_minimum_change(change_cents, denominations)


def _calculate_minimum_change(change_cents: int, denominations: Dict[str, int]) -> Dict[str, int]:
    """Calculate minimum number of coins using greedy algorithm"""
    # Sort denominations in descending order
    sorted_denoms = sorted(denominations.items(), key=lambda x: x[1], reverse=True)
    
    result = {}
    remaining = change_cents
    
    for coin_name, coin_value in sorted_denoms:
        if remaining >= coin_value:
            count = remaining // coin_value
            result[coin_name] = count
            remaining -= count * coin_value
    
    return result


def _generate_random_change(change_cents: int, denominations: Dict[str, int]) -> Dict[str, int]:
    """
    Generate a random valid combination of denominations that sum to change_cents.
    Strategy: Start with minimum change, then randomly break down larger denominations
    into smaller ones while preserving the total amount.
    """
    # Get the minimum change solution as starting point
    result = _calculate_minimum_change(change_cents, denominations)
    
    # Create a list of denominations sorted by value (descending)
    sorted_denoms = sorted(denominations.items(), key=lambda x: x[1], reverse=True)
    
    # Try to randomize by breaking down larger coins into smaller ones
    # Do multiple passes to increase randomness
    for _ in range(10):  # Number of randomization passes
        # Find a denomination that we can break down
        for i, (coin_name, coin_value) in enumerate(sorted_denoms):
            if result.get(coin_name, 0) > 0:
                # Try to break this coin into smaller denominations
                # Find the next smaller denomination
                if i + 1 < len(sorted_denoms):
                    next_coin_name, next_coin_value = sorted_denoms[i + 1]
                    
                    # Check if we can break one coin of current denomination
                    # into multiple coins of next denomination
                    if coin_value % next_coin_value == 0:
                        # Perfect breakdown possible
                        breakdown_count = coin_value // next_coin_value
                        if random.choice([True, False]):  # 50% chance to break down
                            # Break down one coin
                            result[coin_name] -= 1
                            result[next_coin_name] = result.get(next_coin_name, 0) + breakdown_count
                    else:
                        # Imperfect breakdown - we need to use multiple smaller denominations
                        # For simplicity, let's try to break into the smallest denomination (penny/cent)
                        # Find the smallest denomination (should be 1)
                        smallest_coin_name, smallest_coin_value = sorted_denoms[-1]
                        if smallest_coin_value == 1 and random.choice([True, False]):
                            # Break one coin into individual cents
                            result[coin_name] -= 1
                            result[smallest_coin_name] = result.get(smallest_coin_name, 0) + coin_value
    
    # Clean up zero counts
    result = {k: v for k, v in result.items() if v > 0}
    
    # Verify total is correct (safety check)
    total = sum(count * denominations[coin] for coin, count in result.items())
    if total != change_cents:
        # Fallback to minimum change if something went wrong
        return _calculate_minimum_change(change_cents, denominations)
    
    return result


def format_change_output(change_dict: Dict[str, int]) -> str:
    """Format change dictionary into human-readable string"""
    if not change_dict:
        return ""
        
    parts = []
    for coin_name, count in change_dict.items():
        if count == 0:
            continue
            
        # Handle pluralization
        if count == 1:
            display_name = coin_name
            # Special case for penny -> penny (singular)
            if coin_name == 'penny':
                display_name = 'penny'
        else:
            # Handle plural forms
            if coin_name == 'penny':
                display_name = 'pennies'
            else:
                display_name = coin_name + 's'
                
        parts.append(f"{count} {display_name}")
        
    return ",".join(parts)


def process_file(input_file_path: str, output_file_path: str, 
                denominations: Dict[str, int], random_divisor: int = None):
    """
    Process input file and write formatted change output to output file
    """
    with open(input_file_path, 'r') as infile, open(output_file_path, 'w') as outfile:
        for line in infile:
            line = line.strip()
            if not line:
                continue
                
            try:
                owed_str, paid_str = line.split(',')
                owed = float(owed_str.strip())
                paid = float(paid_str.strip())
                
                change_dict = calculate_change(owed, paid, denominations, random_divisor)
                formatted_output = format_change_output(change_dict)
                outfile.write(formatted_output + '\n')
                
            except (ValueError, IndexError) as e:
                # Handle malformed lines - write empty line or error indicator
                outfile.write('\n')