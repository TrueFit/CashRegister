# Project Name: Cash Register
# Author: Kurt Holliday
#
# Project Description: 
# Cash Register generates a string for a cashier
# that displays the quantity of each bill and coin to
# render change. As a twist, the bill/coin quantity is
# randomized if the owed amount is divisible by 3. 



import sys
import os
import random

###########################
# Definitions
###########################

def convertInput(new_str):
    """Converts string to integer
    Multiplies number by 100 to avoid decimals
    """
    input_num = float(new_str) * 100
    output_num = int(input_num)
    return output_num

def isTwist(amt):
    """Returns true if owed amount is divisible by three
    """
    if (amt%3):
        return False # No Twist
    else:
        return True # Twist Change

def randomizeCount(amt):
    """Change the max quantity of a coin to a random quantity
    within a range
    """
    new_ct = random.randint(0,amt)
    return new_ct

def getLabel(new_str,new_val):
    """Determine if coin label should be singular or plural
    """
    if new_val>1:
        for singular_lbl,plural_lbl,val in currencies[currency]:
            if new_str == singular_lbl:
                return plural_lbl
    else:
        return new_str


###########################
# Initializations
###########################

# Initialize Output File Location
sys_output = 'register_output.txt'

# Available currencies (value multiplied by 100 to avoid decimals)
# Format 'name' : (singular label, plural label, value)
currencies = {'usd' : [('Hundred','Hundreds',10000),('Fifty','Fifties',5000),('Twenty','Twenties',2000),('Ten','Tens',1000),('Five','Fives',500),('One','Ones',100),('Quarter','Quarters',25),('Dime','Dimes',10),('Nickel','Nickels',5),('Penny','Pennies',1)]}

# Default Currency for Register
currency = 'usd'

# Initialize output summary
output_summary = ''

###########################
# Read the Input File
###########################

while True:
    user_input = input("Enter input file path (or q to quit): ")

    # Read file or 'q' to quit the program
    if user_input.lower() == "q":
        print ("Goodbye")
        sys.exit()
    else:
        try:
            with open(user_input, 'r') as input_file:
                transactions = input_file.read()
                break
        except:
            print("Invalid File Path. Please try again (or q to quit): ")



###########################
# Process Transactions
# Example Input: 12.23,14.00
###########################

for line in transactions.split('\n'):
    has_due = True # flag valid if amount is due
    line_data = line.split(",")
    owed = convertInput(line_data[0]) # Owed for item
    paid = convertInput(line_data[1]) # Paid by customer
    due = paid-owed # Due to customer

    output_txt = "" # String written to output summary

    # If no change, write no change
    # set flag to skip maing change
    if due==0:
        output_txt = "No change"
        has_due = False

    # If not enough change, write Insufficient change
    # set flag to skip maing change
    if due<0:
        output_txt = "Insufficient amount"
        has_due = False

    # Initialize currency counter
    ctrDict = {}
    for singular_lbl,plural_lbl,val in currencies[currency]:
        ctrDict[singular_lbl] = 0


    # If Owed is divisible by 3, reorder currency list
    # Else use regular currency list order
    if (isTwist(owed)):
        while due and has_due:
            record = random.choice(currencies[currency])
            singular_lbl = record[0]
            val = record[2]
            new_ct = due//val
            new_ct = randomizeCount(new_ct) # Randomize quantity
            ctrDict[singular_lbl] += new_ct
            due = due - (new_ct*val)
    else:
        while due and has_due:
            for singular_lbl,plural_lbl,val in currencies[currency]:
                new_ct = due//val
                ctrDict[singular_lbl] += new_ct
                due = due%val

    # create output string from counter dictionary
    # Example output: 2 quarters,1 dime,3 pennies
    for key,val in ctrDict.items():
        if val > 0:
            lbl = getLabel(key,val)
            output_txt += str(ctrDict.get(key)) + ' ' + lbl + ','

    # Write output string to file
    output_summary += (output_txt.rstrip(',')+'\n')

# Write output string to file
with open(sys_output, 'w') as output_file:
    output_file.write(output_summary)
print("Done.")
