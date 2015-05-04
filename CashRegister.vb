Imports System.IO
Imports System.Configuration
Imports System.Text

Module CashRegister

    Sub Main()

        Dim sr As StreamReader = New StreamReader(ConfigurationManager.AppSettings("InputFile"))
        Dim outFile As String = ConfigurationManager.AppSettings("OutputFile")
        If File.Exists(outFile) = True Then
            File.Delete(outFile)
        End If
        Dim sw As StreamWriter = New StreamWriter(outFile)
        sw.Close()
        sw = File.AppendText(outFile)

        Dim line As String
        Dim counter As Int16 = 1 ' used to show which line is processing in output window
        Dim ChangeLine As Dictionary(Of Decimal, Int32) = New Dictionary(Of Decimal, Int32) ' holds the amount and type of change 
        Dim outPutLine As StringBuilder = New StringBuilder

        ' Read and display the lines from the file until the end of the file is reached. 
        Do
            Console.WriteLine("Processing line: " & counter) ' show processing message to ouptput window 
            counter = counter + 1
            line = sr.ReadLine()

            If Not line Is Nothing Then ' test here to make sure we have a vaild line
                Dim saleAmount As Decimal = Convert.ToDecimal(line.Substring(0, InStr(line, ",") - 1))
                Dim AmountTendered As Decimal = Convert.ToDecimal(line.Substring(InStr(line, ",")))

                If saleAmount < AmountTendered Then ' check to make sure enough money was given to cover bill 
                    Dim DivideTest As Decimal = saleAmount / 3
                    Dim x As String = DivideTest.ToString
                    If (x.Substring(InStr(x, ".")).Length) <= 2 Then ' is it divisable by 3 so check length of decimal places fo 2 or less
                        'call ramdom change routine
                        MakeRandomChange(saleAmount, AmountTendered, ChangeLine)
                    Else
                        'call change routine
                        MakeChange(saleAmount, AmountTendered, ChangeLine)
                    End If

                    'now that we have the change amounts we output the file 
                    outPutLine.Clear()
                    For Each pair As KeyValuePair(Of Decimal, Int32) In ChangeLine
                        Select Case pair.Key
                            Case 20 ' twenties 
                                outPutLine.Append(pair.Value)
                                outPutLine.Append(" ")
                                outPutLine.Append(IIf(pair.Value > 1, "Twenties, ", "Twenty, "))
                            Case 10 ' tens
                                outPutLine.Append(pair.Value)
                                outPutLine.Append(" ")
                                outPutLine.Append(IIf(pair.Value > 1, "Tens, ", "Ten, "))
                            Case 5 ' fives 
                                outPutLine.Append(pair.Value)
                                outPutLine.Append(" ")
                                outPutLine.Append(IIf(pair.Value > 1, "Fives, ", "Five, "))
                            Case 1 ' ones 
                                outPutLine.Append(pair.Value)
                                outPutLine.Append(" ")
                                outPutLine.Append(IIf(pair.Value > 1, "Dollars, ", "Dollar, "))
                            Case 0.25 ' quarters 
                                outPutLine.Append(pair.Value)
                                outPutLine.Append(" ")
                                outPutLine.Append(IIf(pair.Value > 1, "Quarters, ", "Quarter, "))
                            Case 0.1 'dimes 
                                outPutLine.Append(pair.Value)
                                outPutLine.Append(" ")
                                outPutLine.Append(IIf(pair.Value > 1, "Dimes, ", "Dime, "))
                            Case 0.05 ' nickles 
                                outPutLine.Append(pair.Value)
                                outPutLine.Append(" ")
                                outPutLine.Append(IIf(pair.Value > 1, "Nickles, ", "Nickle, "))
                            Case 0.01 ' pennies 
                                outPutLine.Append(pair.Value)
                                outPutLine.Append(" ")
                                outPutLine.Append(IIf(pair.Value > 1, "Pennies ", "Penny "))
                        End Select
                    Next
                Else ' not enough money given 
                    outPutLine.Clear()
                    outPutLine.Append("Not enough money tendered")
                End If

                'output the line we built from above 
                sw.WriteLine(outPutLine.ToString)
            End If

        Loop Until line Is Nothing

        'Write the file
        If Not sw Is Nothing Then
            sw.Flush()
            sw.Close()
        End If

        sr.Close()

    End Sub

    Public Sub MakeChange(ByVal saleAmount As Decimal, ByVal AmountTendered As Decimal, ByRef ChangeLine As Dictionary(Of Decimal, Int32))
        ChangeLine.Clear()
        Dim remaingchange As Decimal = AmountTendered - saleAmount
        Dim NumberOfDenomination As Int32 ' used to hold the number of each denomination of change example 2 ten dollar bills
        Dim Denomination As Decimal ' used to hold the type of denomination of change example ten dollar bill 

        ' the math explained 
        'first - get the number of each Denomination needed 
        'second - add that number of bills or change to the dictionary 
        'third - reduce the remaining change by the amount just calculated

        Do While remaingchange > 0
            Select Case remaingchange
                Case Is >= 20 ' twenties 
                    Denomination = 20
                Case Is >= 10 ' tens 
                    Denomination = 10
                Case Is >= 5 ' fives 
                    Denomination = 5
                Case Is >= 1 ' ones 
                    Denomination = 1
                Case Is >= 0.25 'quarters 
                    Denomination = 0.25
                Case Is >= 0.1 ' dimes 
                    Denomination = 0.1
                Case Is >= 0.05 ' nickles 
                    Denomination = 0.05
                Case Is >= 0.01 ' pennies 
                    Denomination = 0.01
            End Select

            NumberOfDenomination = Math.Truncate(remaingchange / Denomination)
            ChangeLine.Add(Denomination, NumberOfDenomination)
            remaingchange = remaingchange - (NumberOfDenomination * Denomination)
        Loop

    End Sub

    Public Sub MakeRandomChange(saleAmount As Decimal, AmountTendered As Decimal, ByRef ChangeLine As Dictionary(Of Decimal, Int32))
        ChangeLine.Clear()
        Dim remaingchange As Decimal = AmountTendered - saleAmount
        Dim NumberOfDenomination As Int32 ' used to hold the number of each denomination of change example 2 ten dollar bills
        Dim Denomination As Decimal ' used to hold the type of denomination of change example ten dollar bill 

        Dim minValue As Decimal = 0.01
        Dim maxvalue As Decimal
        Dim randomResult As Decimal

        Do While remaingchange > 0
            Select Case remaingchange
                Case Is >= 20 ' twenties 
                    maxvalue = 20
                Case Is >= 10 ' tens 
                    maxvalue = 10
                Case Is >= 5 ' fives 
                    maxvalue = 5
                Case Is >= 1 ' ones 
                    maxvalue = 1
                Case Is >= 0.25 'quarters 
                    maxvalue = 0.25
                Case Is >= 0.1 ' dimes 
                    maxvalue = 0.1
                Case Is >= 0.05 ' nickles 
                    maxvalue = 0.05
                Case Is >= 0.01 ' pennies 
                    maxvalue = 0.01
            End Select

            Randomize(Timer)
            randomResult = ((maxvalue - minValue) * Rnd()) + minValue

            Select Case randomResult
                Case Is >= 20 ' twenties 
                    Denomination = 20
                Case Is >= 10 ' tens 
                    Denomination = 10
                Case Is >= 5 ' fives 
                    Denomination = 5
                Case Is >= 1 ' ones 
                    Denomination = 1
                Case Is >= 0.25 'quarters 
                    Denomination = 0.25
                Case Is >= 0.1 ' dimes 
                    Denomination = 0.1
                Case Is >= 0.05 ' nickles 
                    Denomination = 0.05
                Case Is >= 0.01 ' pennies 
                    Denomination = 0.01
            End Select

            NumberOfDenomination = Math.Truncate(remaingchange / Denomination)
            ChangeLine.Add(Denomination, NumberOfDenomination)
            remaingchange = remaingchange - (NumberOfDenomination * Denomination)
        Loop
    End Sub

End Module
