import random
import os
from .constants import DENOMINATIONS, INPUT_TYPES, EXPORT_TYPES
from .config import config
from .helpers import formatChange, currencyExchange, randomCurrency
from .cashRegisterIO import transactionsImporter, changeDueExporter
from .exceptions import invalidInput

"""
CashRegister.py

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

"""
    Import & Exporter Classes
    Transaction data passed to classes to parse data
    Handle variable IO scenarios based on passed configuration
"""
importer = transactionsImporter()
exporter = changeDueExporter()


class CashRegister(object):

    def __init__(self,
                 import_file=None,
                 json_transactions=None,
                 import_method=None,
                 export_method=None,
                 payment_cc=None,
                 change_cc=None,
                 specialFnc=[]):
        # Instance Variable to send to exporter class
        self.change_due_log = []
        # Instance Variable to store transactions returned from Importer
        self.transactions = []
        # Allow configuration to be provided to object during instantiation OR default to config file
        self.import_method = import_method if import_method else config['import_method']
        self.import_file = import_file if import_file else config['import_file']
        self.json_transactions = json_transactions if json_transactions else None
        self.export_method = export_method if export_method else config['export_method']
        self.change_cc = change_cc if change_cc else config['CHANGE_COUNTRY_CODE']
        self.payment_cc = payment_cc if payment_cc else config['PAYMENT_COUNTRY_CODE']
        # Dictionary containing prefined special cases - divisibleBy & excludeFives
        self.specialFnc = specialFnc

        # Get currency denominations for country the change will be returned
        self.country_currency = DENOMINATIONS[self.change_cc]

        # Import & Validate Transactions List From Source
        self.transactions = importer.importTransactions(
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

        # Predefined Special Case - Exclude Five Dollar Bills/Euros from change due
        if 'excludeFives' in self.specialFnc and self.specialFnc['excludeFives'] == True:
            new_currency = dict(self.country_currency)
            del new_currency[500]
            self.country_currency = new_currency

        # Determine if payment was provided in a different currency than the change (transaction)
        # This will trigger the amt_tendered to be converted to the return currency
        # Currency options are set for the entire transaction list (not individually)
        exchange_needed = True if self.payment_cc != self.change_cc else False

        for transaction in self.transactions:
            change_due = []
            # Extract transaction details for row
            try:
                amt_owed = transaction[0]
                amt_tendered = transaction[1]
            except:
                # Data was not formated properly, skip this transaction
                self.change_due_log.append(
                    {'amt_owed': "", 'amt_tendered': "", 'change_due': ["Error Parsing - Data not formatted correctly"]})
                continue

            if exchange_needed:
                # Convert payment tendered ammount to the same currency that will be returned
                # Params From Country, To Country, Ammount
                amt_tendered = currencyExchange(
                    self.payment_cc, self.change_cc, amt_tendered)

            try:
                change = amt_tendered - amt_owed
            except TypeError:
                """
                    ERROR - determining change  -  Skip current itteration
                    Continue script to check for other valid transactions
                """
                self.change_due_log.append(
                    {'amt_owed': "", 'amt_tendered': "", 'change_due': ["Error Parsing - Data not formatted correctly"]})
                continue

                # OPTIMIZE   replace below with change==0 : addNoChange ? change < 0 ? addInsufficient : True
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

            # Test special case - Random
            if 'divisibleBy3' in self.specialFnc and self.specialFnc['divisibleBy3']:
                self.country_currency = randomCurrency(
                    self.country_currency, amt_owed, 3)

            # temp variable to track progress of providing change
            tmp_change = change
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
        return exporter.export(export_type=self.export_method,
                               payload=self.change_due_log)


def main(args=None):
    cr = CashRegister()
    cr.createChange()
    cr.exportChange()
