"""
Currency denomination definitions.
Each currency is defined as a dictionary mapping coin/bill names to their values in cents.
"""

# US Dollar denominations (in cents)
USD_DENOMINATIONS = {
    'dollar': 100,
    'quarter': 25,
    'dime': 10,
    'nickel': 5,
    'penny': 1
}

# Euro denominations (in cents)
EUR_DENOMINATIONS = {
    '2_euro': 200,
    '1_euro': 100,
    '50_cent': 50,
    '20_cent': 20,
    '10_cent': 10,
    '5_cent': 5,
    '2_cent': 2,
    '1_cent': 1
}

# Mexican Peso denominations (in centavos)
MXN_DENOMINATIONS = {
    '20_peso': 2000,
    '10_peso': 1000,
    '5_peso': 500,
    '2_peso': 200,
    '1_peso': 100,
    '50_centavo': 50,
    '20_centavo': 20,
    '10_centavo': 10,
    '5_centavo': 5,
    '1_centavo': 1
}

# Helper function to get denomination by currency code
def get_denominations(currency_code='USD'):
    """Return denominations for given currency code"""
    denominations_map = {
        'USD': USD_DENOMINATIONS,
        'EUR': EUR_DENOMINATIONS,
        'MXN': MXN_DENOMINATIONS
    }
    return denominations_map.get(currency_code, USD_DENOMINATIONS)