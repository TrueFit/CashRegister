import decimal
import json
import random
import requests
from .constants import CURRENCY_API_KEY


def formatChange(count, currency):
    if count < 2:
        return "{} {}".format(str(count), currency)
    currency_string = currency + \
        's' if not currency[-1:] == 'y' else currency[:-1]+'ies'
    return "{} {}".format(str(count), currency_string)


def randomize(avail_currancy):
    """
        Used to shuffle order of currency for special cases
    """
    keys = list(avail_currancy.keys())
    random.shuffle(keys)
    return dict([(key, avail_currancy[key]) for key in keys])


def currencyExchange(from_cc, to_cc, ammount):
    currency_key = from_cc+"_"+to_cc
    params = {
        "q": currency_key,
        "compact": "ultra",
        "apiKey": CURRENCY_API_KEY
    }
    response = requests.get(
        "https://free.currconv.com/api/v7/convert", params=params)
    response_dict = json.loads(response.text)
    conversion_rate = response_dict[currency_key]
    conversion_ammount = (ammount / 100)
    response_value = (conversion_rate * conversion_ammount)
    return convertToInt(response_value)


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
