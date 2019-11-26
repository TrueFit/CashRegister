import sys
import os
import json
import csv
import uuid
from pathlib import Path
from .constants import INPUT_TYPES, EXPORT_TYPES
from .helpers import convertToInt
from .config import config


class transactionsImporter(object):

    def __init__(self):
        self.transactions = []

    def importTransactions(self, input_type, input_file=None, json_transactions=None):
        if input_type == INPUT_TYPES['FLAT_FILE']:
            if not input_file:
                print("No input file specified")
                return None
            self.transactions = self.transactionFileReader(input_file)
        elif input_type == INPUT_TYPES['MANUAL']:
            self.transactions = self.transactionManualReader()
        elif input_type == INPUT_TYPES['JSON']:
            self.transactions = self.transactionJSONReader(json_transactions)
        else:
            print("Invalid or No input type set")
            return None

        return self.transactions

    def transactionFileReader(self, flat_file):
        """
            Loops through transaction flat files
            Converts decimal/string values to integers

            Input :
                CSV Flat File
                One Transaction per line
                Amount Tendered, Amount Owed
            Output :
                A list of tuples containing transaction details
        """

        total_transactions = 0
        # TODO Test file exist first ?
        # if os.path.exists(flat_file):
        try:
            flat_file = os.path.join(Path().absolute(), flat_file)
            with open(flat_file) as transactions_file:
                csv_reader = csv.reader(transactions_file, delimiter=',')
                for row in csv_reader:
                    self.transactions.append((
                        convertToInt(row[0]),  # amt_owed
                        convertToInt(row[1])  # amt_tendered
                    ))
                    total_transactions += 1
        except IOError as e:
            print('I/O error({0}): {1}'.format(e.errno, e.strerror))
        except Exception as e:
            # FIXME - Send to log file
            print("unexpected exception during flat file read -- " + str(e))

        return self.transactions

    def transactionManualReader(self):
        """
            Manual transaction reader
            Accepts input from bash
        """
        print("Please enter transactions comma seperated - 1 transaction per line")
        print("Format the input as : amount owed, amount tendered")
        print("Example : 3.00, 2.15")
        while True:
            try:
                manual_input = input()
                if not manual_input:
                    raise EOFError
                amt_owed, amt_tendered = manual_input.split(',')
                self.transactions.append((
                    convertToInt(amt_owed),
                    convertToInt(amt_tendered)
                ))
            except EOFError:
                break
        return self.transactions

    def transactionJSONReader(self, json_transactions):
        # self.transactions = json.loads(json_transactions)
        transactions_list = []

        for transaction in json_transactions:
            amt_owed = transaction[0]
            amt_tendered = transaction[1]
            transactions_list.append((
                convertToInt(amt_owed),
                convertToInt(amt_tendered)
            ))
        return transactions_list


class changeDueExporter(object):
    def export(self,  export_type, payload):
        if export_type == EXPORT_TYPES['FLAT_FILE']:
            return self.changeDueLogWritter(payload)
        elif export_type == EXPORT_TYPES['SCREEN']:
            return self.changeDueScreenWritter(payload)
        elif export_type == EXPORT_TYPES['JSON']:
            return self.changeDueJSONWritter(payload)

    def changeDueJSONWritter(self, change_due_list):
        # return json.dumps(change_due_list)
        return change_due_list

    def changeDueScreenWritter(self, change_due_list):
        for change_due in change_due_list:
            print(', '.join(change_due))

    def changeDueLogWritter(self, change_due_list):
        """
            Write change due to CSV file
            Ouput path configured in Config.py
        """
        if len(change_due_list) == 0:
            return None
        file_name = str(uuid.uuid1())+".csv"
        flat_file_path = (Path(__file__).parent /
                          config['export_file_folder']).resolve()
        output_file = Path(flat_file_path / file_name).resolve()
        with open(output_file, 'w') as csvfile:
            filewriter = csv.writer(
                csvfile, delimiter=',',
                quotechar='|',
                quoting=csv.QUOTE_MINIMAL
            )
            for row in change_due_list:
                filewriter.writerow(row)
