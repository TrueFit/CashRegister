import decimal
import json
import random
import requests
from .constants import CURRENCY_API_KEY


def formatChange(count, currency):
    """
        Make currancy name multiple - handles penny->ies
    """
    if count < 2:
        return "{} {}".format(str(count), currency)
    currency_string = currency + \
        's' if not currency[-1:] == 'y' else currency[:-1]+'ies'
    return "{} {}".format(str(count), currency_string)


def randomize(avail_currancy):
    """
        Used to shuffle order of currency for special cases
        Will return change in random order - NOT most efficient
    """
    keys = list(avail_currancy.keys())
    random.shuffle(keys)
    return dict([(key, avail_currancy[key]) for key in keys])


def randomCurrency(currency, amt_owed, divisor):
    """
        Determine if random should be invoked
        Accepts a variable divisor to check agains
        Will be used in future if client would like to change / add new divisors

    """
    updated_currency = currency
    if amt_owed % divisor == 0:
        updated_currency = randomize(currency)
    return updated_currency


def currencyExchange(from_cc, to_cc, ammount):
    """
        Convert currency using live API
        From country, to country, ammount

    """
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
