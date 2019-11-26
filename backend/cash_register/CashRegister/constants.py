from collections import OrderedDict

CURRENCY_API_KEY = 'a56e6051dd8e2116160d'

# OPTIMIZE - Is this constant method of flat files solving anything? Is this reducing bad config?
INPUT_TYPES = {
    'FLAT_FILE': 'flat_file',
    'MANUAL': 'manual_entry',
    'JSON': 'json'
}
EXPORT_TYPES = {
    'FLAT_FILE': 'flat_file',
    'SCREEN': 'screen',
    'JSON': 'json'
}
# OPTIMIZE -  Use Ordered dict here OR Sort dict when looping to make sure we are using largest denominations first
DENOMINATIONS = {}
DENOMINATIONS["USD"] = OrderedDict()
DENOMINATIONS["USD"][10000] = 'One-hundred Dollar Bill'
DENOMINATIONS["USD"][5000] = 'Fifty Dollar Bill'
DENOMINATIONS["USD"][2000] = 'Twenty Dollar Bill'
DENOMINATIONS["USD"][1000] = 'Ten Dollar Bill'
DENOMINATIONS["USD"][500] = 'Five Dollar Bill'
DENOMINATIONS["USD"][100] = 'Dollar Bill'
DENOMINATIONS["USD"][25] = 'Quarter'
DENOMINATIONS["USD"][10] = 'Dime'
DENOMINATIONS["USD"][5] = 'Nickle'
DENOMINATIONS["USD"][1] = 'Penny'
DENOMINATIONS["EUR"] = OrderedDict()
DENOMINATIONS["EUR"][50000] = 'five-hundred Euros'
DENOMINATIONS["EUR"][20000] = 'Two-hundred Euros'
DENOMINATIONS["EUR"][10000] = 'One-hundred Euros'
DENOMINATIONS["EUR"][5000] = 'Fifty Euros'
DENOMINATIONS["EUR"][2000] = 'Twenty Euros'
DENOMINATIONS["EUR"][1000] = 'Ten Euros'
DENOMINATIONS["EUR"][500] = 'Five Euros'
DENOMINATIONS["EUR"][200] = 'Two Euros'
DENOMINATIONS["EUR"][100] = 'One Euro'
DENOMINATIONS["EUR"][50] = 'Fifty cent coin'
DENOMINATIONS["EUR"][20] = 'Twenty cent coin'
DENOMINATIONS["EUR"][10] = 'Ten cent coin'
DENOMINATIONS["EUR"][5] = 'Five cent coin'
DENOMINATIONS["EUR"][2] = 'Two cent coin'
DENOMINATIONS["EUR"][1] = 'One cent coin'
