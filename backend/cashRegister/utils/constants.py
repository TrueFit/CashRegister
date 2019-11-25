from collections import OrderedDict

# TODO - Make class objects / immutable dictionary so these values are not altered

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
DENOMINATIONS["US"] = OrderedDict()
DENOMINATIONS["US"][10000] = 'One-hundred Dollar Bill'
DENOMINATIONS["US"][5000] = 'Fifty Dollar Bill'
DENOMINATIONS["US"][2000] = 'Twenty Dollar Bill'
DENOMINATIONS["US"][1000] = 'Ten Dollar Bill'
DENOMINATIONS["US"][500] = 'Five Dollar Bill'
DENOMINATIONS["US"][100] = 'Dollar Bill'
DENOMINATIONS["US"][25] = 'Quarter'
DENOMINATIONS["US"][10] = 'Dime'
DENOMINATIONS["US"][5] = 'Nickle'
DENOMINATIONS["US"][1] = 'Penny'
DENOMINATIONS["EU"] = OrderedDict()
DENOMINATIONS["EU"][50000] = 'five-hundred Euros'
DENOMINATIONS["EU"][20000] = 'Two-hundred Euros'
DENOMINATIONS["EU"][10000] = 'One-hundred Euros'
DENOMINATIONS["EU"][5000] = 'Fifty Euros'
DENOMINATIONS["EU"][2000] = 'Twenty Euros'
DENOMINATIONS["EU"][1000] = 'Ten Euros'
DENOMINATIONS["EU"][500] = 'Five Euros'
DENOMINATIONS["EU"][200] = 'Two Euros'
DENOMINATIONS["EU"][100] = 'One Euro'
DENOMINATIONS["EU"][50] = 'Fifty cent coin'
DENOMINATIONS["EU"][20] = 'Twenty cent coin'
DENOMINATIONS["EU"][10] = 'Ten cent coin'
DENOMINATIONS["EU"][5] = 'Five cent coin'
DENOMINATIONS["EU"][2] = 'Two cent coin'
DENOMINATIONS["EU"][1] = 'One cent coin'
