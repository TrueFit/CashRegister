# TODO Create Specific Exceptions



class invalidInput(TypeError):
    def __init__(self, amt_owed, amt_tendered):
        print("There was a problem determining change (" +str(amt_tendered) + ' - ' + str(amt_owed) + ')' )
    #raise TypeError