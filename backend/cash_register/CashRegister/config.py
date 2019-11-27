from .constants import INPUT_TYPES, EXPORT_TYPES

config = {
    'DIVISOR': 3,
    'PAYMENT_COUNTRY_CODE': "USD",
    'CHANGE_COUNTRY_CODE': "EUR",
    'specialFnds': {
        'randomDivisThree': True,
        'excludeFives': False,
    },
    'import_file': 'CashRegister/DATA/Import/transactions.csv',
    'export_file_folder': 'DATA/Export/',
    'import_method': INPUT_TYPES['JSON'],
    'export_method': EXPORT_TYPES['JSON'],
}
