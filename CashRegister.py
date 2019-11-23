import random
from constants import DENOMINATIONS, INPUT_TYPES, EXPORT_TYPES
import config
from helpers import randomize
from cashRegisterIO import transactionsImporter, changeDueExporter
from exceptions import invalidInput

"""
CashRegister.py
version 1 - MVP 
Created by: David Phenicie phenicie.david@gmail.com
Created on: 2019-11-23

This script accepts a flat file location (defined in Config.py) or manual entry
Input values provided are comas seperated Amount Due & Amount Tendered
The system will itterate US currancy and return denominations for change due from transaction using the most efficient amount of currancy
If the ammount due is divisible by 3 - Currency is chosen at random to return change due
Data is returned a single line per input 

Input Example :
2.12,3.00

Output:
3 quarters,1 dime,3 pennies

"""


# TODO - move all sys.exits to custom exceptions file
# FIXME - Should there be an entry in the output file if no change is due??
# TODO - Make special cases pluggable
# TODO - Force final change_due export to contain id for sorting on front end
# TODO - Adjust response for plurals
# TODO - Create LOG file --> exceptions
# TODO - check if change is negative


class CashRegister(object):
    importer = transactionsImporter()
    exporter = changeDueExporter()

    def __init__(self,
                 import_file=None,
                 import_method=None,
                 export_method=None,
                 payment_cc=None,
                 change_cc=None):

        # Allow configuration to be provided to object instance OR default to config file
        self.import_method = import_method if import_method else config.import_method
        self.import_file = import_file if import_file else config.import_file
        self.export_method = export_method if export_method else config.export_method
        self.CHANGE_COUNTRY_CODE = payment_cc if payment_cc else config.CHANGE_COUNTRY_CODE
        self.PAYMENT_COUNTRY_CODE = change_cc if change_cc else config.PAYMENT_COUNTRY_CODE

        self.change_due_log = []

        # Get available currancy denominations for the country the change will be provided in
        self.country_currancy = DENOMINATIONS[self.CHANGE_COUNTRY_CODE]

        # Import & Validate Transactions List From Source
        self.transactions = self.importer.importTransactions(
            input_type=self.import_method,
            input_file=self.import_file
        )
        if len(self.transactions) < 1:
            print("No Transactions Present")
            sys.exit()
        else:
            self.itterateTransactions()

    def itterateTransactions(self):
        # Transactions is a list of tuples - (amt_owed, amt_tendered)
        for transaction in self.transactions:
            change_due = []
            amt_owed = transaction[0]
            amt_tendered = transaction[1]

            try:
                change = amt_tendered - amt_owed

                # Check for change resposne that does not require itteration
                if change == 0:
                    # No change is due - Skip current itteration
                    continue
                elif change < 0:
                    # Payment not sufficient - No change to be given
                    continue

            except TypeError:
                """
                    ERROR - determining change  -  Skip current itteration
                    Continue script to check for other valid transactions
                """
                continue

            # Test special case - Random
            if amt_owed % 3 == 0:
                avail_currancy = randomize(self.country_currancy)

            tmp_change = change  # temp var to track progress
            while tmp_change > 0:
                for currancy in self.country_currancy:
                    curr_currancy_count = tmp_change // currancy  # Floor division to find who number
                    if curr_currancy_count > 0:
                        is_plural = True if curr_currancy_count > 1 else False
                        change_due.append(
                            str(curr_currancy_count) + " " + self.country_currancy[currancy])  # OPTIMIZE
                        tmp_change = tmp_change - \
                            (curr_currancy_count * currancy)

            self.change_due_log.append(change_due)
        self.exportChange()

    def exportChange(self):
        self.exporter.export(export_type=self.export_method,
                             payload=self.change_due_log)


if __name__ == '__main__':
    # CashRegister(export_method="flat_file")
    CashRegister()
