import pytest
from utils.change_calculator import GreedyChangeStrategy, RandomChangeStrategy, get_change_strategy, format_change

def test_greedy_strategy():
    strategy = GreedyChangeStrategy()
    # 41 cents -> 1 quarter, 1 dime, 1 nickel, 1 penny
    change = strategy.calculate_change(41)
    assert change == {"quarter": 1, "dime": 1, "nickel": 1, "penny": 1}
    
    # 99 cents -> 3 quarters, 2 dimes, 4 pennies
    change = strategy.calculate_change(99)
    assert change == {"quarter": 3, "dime": 2, "penny": 4}

def test_random_strategy_sum():
    strategy = RandomChangeStrategy()
    amount = 200 # $2.00
    change = strategy.calculate_change(amount)
    
    total = 0
    denominations = {
        "dollar": 100,
        "quarter": 25,
        "dime": 10,
        "nickel": 5,
        "penny": 1
    }
    
    for name, count in change.items():
        total += count * denominations[name]
        
    assert total == amount

def test_strategy_selection():
    # Divisible by 3 -> Random
    assert isinstance(get_change_strategy(300), RandomChangeStrategy)
    assert isinstance(get_change_strategy(333), RandomChangeStrategy)
    
    # Not divisible by 3 -> Greedy
    assert isinstance(get_change_strategy(100), GreedyChangeStrategy)
    assert isinstance(get_change_strategy(200), GreedyChangeStrategy)

def test_format_change():
    change = {"quarter": 2, "dime": 1, "penny": 3}
    formatted = format_change(change)
    assert "2 quarters" in formatted
    assert "1 dime" in formatted
    assert "3 pennies" in formatted
