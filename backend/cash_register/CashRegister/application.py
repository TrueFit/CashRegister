import random
import os
"""
from cash_register.CashRegister.constants import DENOMINATIONS, INPUT_TYPES, EXPORT_TYPES
from cash_register.CashRegister.config import config
from cash_register.CashRegister.helpers import randomize, formatChange
from cash_register.CashRegister.cashRegisterIO import transactionsImporter, changeDueExporter
from cash_register.CashRegister.exceptions import invalidInput
"""
from .constants import DENOMINATIONS, INPUT_TYPES, EXPORT_TYPES
from .config import config
from .helpers import formatChange, currencyExchange, randomCurrency
from .cashRegisterIO import transactionsImporter, changeDueExporter
from .exceptions import invalidInput

"""
CashRegister.py
version 1 - MVP
Created by: David Phenicie phenicie.david@gmail.
Created on: 2019-11-23

This script accepts a flat file location (defined in Config.py) or manual entry
Input values provided are comas seperated Amount Due & Amount Tendered
The system will itterate US currency and return denominations for change due from transaction using the most efficient amount of currency
If the ammount due is divisible by 3 - Currency is chosen at random to return change due
Data is returned a single line per input

Input Example :
2.12,3.00

Output:
3 quarters,1 dime,3 pennies

"""


# TODO - move all sys.exits to custom exceptions file
# TODO - Make special cases pluggable
# TODO - Create LOG file --> exceptions


class CashRegister(object):

    importer = transactionsImporter()
    exporter = changeDueExporter()

    def __init__(self,
                 import_file=None,
                 json_transactions=None,
                 import_method=None,
                 export_method=None,
                 payment_cc=None,
                 change_cc=None,
                 specialFnc=[]):
        self.change_due_log = []
        self.transactions = []
        # Allow configuration to be provided to object instance OR default to config file
        self.import_method = import_method if import_method else config['import_method']
        self.import_file = import_file if import_file else config['import_file']
        self.json_transactions = json_transactions if json_transactions else None
        self.export_method = export_method if export_method else config['export_method']
        self.change_cc = change_cc if change_cc else config['CHANGE_COUNTRY_CODE']
        self.payment_cc = payment_cc if payment_cc else config['PAYMENT_COUNTRY_CODE']
        self.specialFnc = specialFnc

        # Get available currency denominations for the country the change will be provided in
        self.country_currency = DENOMINATIONS[self.change_cc]

        # Import & Validate Transactions List From Source
        self.transactions = self.importer.importTransactions(
            input_type=self.import_method,
            input_file=self.import_file,
            json_transactions=self.json_transactions
        )

    def createChange(self):
        # Transactions is a list of tuples/list - (amt_owed, amt_tendered)
        # Create change due for each transaction in list
        if not self.transactions or len(self.transactions) < 1:
            print("No Transactions Present")
            return None

        if 'excludeFives' in self.specialFnc and self.specialFnc['excludeFives'] == True:
            new_currency = dict(self.country_currency)
            del new_currency[500]
            self.country_currency = new_currency

        exchange_needed = True if self.payment_cc != self.change_cc else False
        for transaction in self.transactions:

            change_due = []
            amt_owed = transaction[0]
            amt_tendered = transaction[1]

            if exchange_needed:
                # Convert payment tendered ammount to the same currency that will be returned
                amt_tendered = currencyExchange(
                    self.payment_cc, self.change_cc, amt_tendered)

            try:
                change = amt_tendered - amt_owed

                # Check for change response that does not require itteration
                if change == 0:
                    # No change is due - Skip current itteration
                    self.change_due_log.append(
                        {'amt_owed': amt_owed, 'amt_tendered': amt_tendered, 'change_due': ["No Change Owed"]})
                    continue
                elif change < 0:
                    # Payment not sufficient - No change to be given
                    self.change_due_log.append({'amt_owed': amt_owed, 'amt_tendered': amt_tendered, 'change_due': ["Insufficient Funds - Please pay {}".format(
                        abs(change/100))]}

                    )
                    continue

            except TypeError:
                """
                    ERROR - determining change  -  Skip current itteration
                    Continue script to check for other valid transactions
                """
                continue

            # Test special case - Random
            if 'divisibleBy3' in self.specialFnc and self.specialFnc['divisibleBy3']:
                self.country_currency = randomCurrency(
                    self.country_currency, amt_owed, 3)

            tmp_change = change  # temp var to track progress
            while tmp_change > 0:
                for currency in self.country_currency:
                    curr_currency_count = tmp_change // currency  # Floor division to find who number
                    if curr_currency_count > 0:
                        change_due.append(
                            formatChange(
                                curr_currency_count, self.country_currency[currency])
                        )  # OPTIMIZE
                        tmp_change = (
                            tmp_change - (curr_currency_count * currency))

            self.change_due_log.append(
                {'amt_owed': amt_owed, 'amt_tendered': amt_tendered, 'change_due': change_due})

    def exportChange(self):
        return self.exporter.export(export_type=self.export_method,
                                    payload=self.change_due_log)


def main(args=None):
    cr = CashRegister()
    cr.createChange()
    cr.exportChange()
