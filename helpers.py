import decimal
import random


def randomize(avail_currancy):
    """ 
        Used to shuffle order of currency for special cases
    """
    keys = list(avail_currancy.keys())
    random.shuffle(keys)
    return dict([(key, avail_currancy[key]) for key in keys])


def convertToInt(dec_value):
    """ 
        All currancy is converted to whole number integer to reduce floating point errors
    """
    try:
        if isinstance(dec_value, str):
            dec_value = decimal.Decimal(dec_value.strip())
        return int(dec_value * 100)
    except decimal.InvalidOperation as e:  # decimal.InvalidOperation
        print("Unable to convert " + str(dec_value) +
              " to decimal - Please correct input")
        return None  # FIXME - Create customized exceptions file
