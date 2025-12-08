import random
from abc import ABC, abstractmethod
from typing import Dict, List

class ChangeStrategy(ABC):
    @abstractmethod
    def calculate_change(self, amount_cents: int) -> Dict[str, int]:
        pass

class GreedyChangeStrategy(ChangeStrategy):
    def calculate_change(self, amount_cents: int) -> Dict[str, int]:
        denominations = [
            ("dollar", 100),
            ("quarter", 25),
            ("dime", 10),
            ("nickel", 5),
            ("penny", 1)
        ]
        change = {}
        remaining = amount_cents
        
        for name, value in denominations:
            count = remaining // value
            if count > 0:
                change[name] = count
                remaining %= value
                
        return change

class RandomChangeStrategy(ChangeStrategy):
    def calculate_change(self, amount_cents: int) -> Dict[str, int]:
        # This strategy randomly picks denominations until the sum equals amount_cents
        # To ensure it terminates and is somewhat reasonable, we can be a bit smart but still random.
        # However, the requirement says "randomly generate the change denominations".
        # A pure random approach might be inefficient for large amounts, but let's try a simple approach:
        # Randomly pick a denomination that is <= remaining amount, subtract, repeat.
        
        denominations = [
            ("dollar", 100),
            ("quarter", 25),
            ("dime", 10),
            ("nickel", 5),
            ("penny", 1)
        ]
        
        change = {}
        remaining = amount_cents
        
        while remaining > 0:
            # Filter denominations that fit
            possible_denoms = [d for d in denominations if d[1] <= remaining]
            if not possible_denoms:
                # Should not happen with penny=1, but safety check
                break
                
            # Pick one randomly
            name, value = random.choice(possible_denoms)
            
            change[name] = change.get(name, 0) + 1
            remaining -= value
            
        return change

def format_change(change_dict: Dict[str, int]) -> str:
    parts = []
    # Sort by value desc for better readability usually, but for random it might be funny to be random order?
    # Let's stick to a standard order for display if possible, or just iterate.
    # The requirement example: "1 dollar,2 quarters,1 nickel"
    
    # Let's order by standard denomination value for the output string to look somewhat organized
    order = ["dollar", "quarter", "dime", "nickel", "penny"]
    
    for name in order:
        count = change_dict.get(name, 0)
        if count > 0:
            plural = name if name.endswith('s') else name + "s"
            label = name if count == 1 else plural
            # Special case for penny/pennies
            if name == "penny" and count > 1:
                label = "pennies"
            
            parts.append(f"{count} {label}")
            
    return ", ".join(parts)

def get_change_strategy(total_due_cents: int) -> ChangeStrategy:
    if total_due_cents > 0 and total_due_cents % 3 == 0:
        return RandomChangeStrategy()
    return GreedyChangeStrategy()
