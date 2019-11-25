from .constants import INPUT_TYPES, EXPORT_TYPES

config = {
    'DIVISOR': 3,
    'PAYMENT_COUNTRY_CODE': "US",
    'CHANGE_COUNTRY_CODE': "US",
    'ALTERCATIONS': {
        (3, 'randomDivisThree'),
    },
    'import_file': 'DATA/Import/transactions.csv',
    'export_file_folder': 'DATA/Export/',
    'import_method': INPUT_TYPES['FLAT_FILE'],
    'export_method': EXPORT_TYPES['SCREEN'],
}
