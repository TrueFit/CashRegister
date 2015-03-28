Namespace BL
    Public Class ChangeRows
        Public owed As Decimal
        Public paid As Decimal
    End Class

    Public Class ChangeCalculator
        Inherits CommonPage

        ' New Instance
        Public Sub New()
        End Sub

        ' Some integers we will need in the calculation later
        Private Enum CentsInA As Integer
            Dollar = 100
            Quarter = 25
            Dime = 10
            Nickel = 5
            Penny = 1
        End Enum

        ' Push our DataTable into our list of ChangeRows objects for easlier iteration
        Public Overridable Function CreateQueue(ByVal dt As DataTable) As List(Of ChangeRows)
            Dim list As New List(Of ChangeRows)

            For Each r As DataRow In dt.Rows
                Dim cr As New ChangeRows()
                cr.owed = r.Item(0)
                cr.paid = r.Item(1)
                list.Add(cr)
            Next

            Return list
        End Function

        ' Subtracts owed from paid, but also makes sure the result isn't positive (paid less than owed)
        Public Overridable Function CalculateChange(ByVal owed As Decimal, ByVal paid As Decimal) As Decimal
            Dim change As Decimal = 0
            change = (owed - paid)

            If change > 0 Then
                _message.AppendLine(String.Format("Input {0},{1} - This transaction resulted in money loss.", owed, paid))
            End If

            Return change
        End Function

        ' Calculates the change that produces the least amount of coins
        Public Overridable Function CalculateBest(ByVal change As Decimal) As String
            Dim list As New List(Of Integer)
            Dim val As Integer = Me.ConvertToPennies(change)
            Dim dollar As Integer = 0, quarter As Integer = 0, dime As Integer = 0, nickel As Integer = 0, penny As Integer = 0

            list = Me.GetBestChange(val, dollar, CentsInA.Dollar).ToList()
            dollar = list(0)
            val = list(1)

            list = Me.GetBestChange(val, quarter, CentsInA.Quarter).ToList()
            quarter = list(0)
            val = list(1)

            list = Me.GetBestChange(val, dime, CentsInA.Dime).ToList()
            dime = list(0)
            val = list(1)

            list = Me.GetBestChange(val, nickel, CentsInA.Nickel).ToList()
            nickel = list(0)
            val = list(1)

            list = Me.GetBestChange(val, penny, CentsInA.Penny).ToList()
            penny = list(0)

            Return Me.FormatResult(dollar, quarter, dime, nickel, penny)
        End Function

        ' Calculates a random amount of each of the coins totalling the change.
        ' The optional param min is defaulted to 1 because if set to 0, this could
        ' iterate thousands of times. If the min = 0, it will cap out the iterations
        ' at 10000 to keep this from running infinitely
        Public Overridable Function CalculateRandom(ByVal change As Decimal, Optional ByVal min As Integer = 1) As String
            Dim val As Integer = Me.ConvertToPennies(change)
            Dim dollar As Integer = 0, quarter As Integer = 0, dime As Integer = 0, nickel As Integer = 0, penny As Integer = 0, count As Integer = 0
            Dim MaxIterations As Integer = 10000

            Do While val > 0 AndAlso count < MaxIterations
                Dim order As Integer() = Me.OrderRandom({CentsInA.Dollar, CentsInA.Quarter, CentsInA.Dime, CentsInA.Nickel, CentsInA.Penny})

                For Each o As Integer In order
                    Dim list As New List(Of Integer)

                    Select Case o
                        Case CentsInA.Dollar
                            list = Me.GetRandomChange(val, dollar, CentsInA.Dollar, min).ToList()
                            dollar = list(0)
                        Case CentsInA.Quarter
                            list = Me.GetRandomChange(val, quarter, CentsInA.Quarter, min).ToList()
                            quarter = list(0)
                        Case CentsInA.Dime
                            list = Me.GetRandomChange(val, dime, CentsInA.Dime, min).ToList()
                            dime = list(0)
                        Case CentsInA.Nickel
                            list = Me.GetRandomChange(val, nickel, CentsInA.Nickel, min).ToList()
                            nickel = list(0)
                        Case CentsInA.Penny
                            list = Me.GetRandomChange(val, penny, CentsInA.Penny, min).ToList()
                            penny = list(0)
                        Case Else
                            Exit For
                    End Select

                    val = list(1)
                Next

                count += 1
            Loop

            Return Me.FormatResult(dollar, quarter, dime, nickel, penny)
        End Function

#Region "Helper Functions"
        ' Returns Integer array with the best change option for that unit
        Public Overridable Function GetBestChange(ByVal val As Integer, ByVal total As Integer, ByVal unit As Integer) As Integer()
            If val > 0 AndAlso val >= unit Then
                total = (val \ unit)
                val = Me.HasRemainder(val, unit, False)
            End If

            Return {total, val}
        End Function

        ' Returns Integer array with a random change option for that unit
        Public Overridable Function GetRandomChange(ByVal val As Integer, ByVal total As Integer, ByVal unit As Integer, Optional ByVal min As Integer = 0) As Integer()
            If val > 0 AndAlso val >= unit Then
                Dim random As Integer = Me.FindRandom(min, (val \ unit))
                total += random
                val = (val - (random * unit))
            End If

            Return {total, val}
        End Function

        ' Checks if the input has a remainder or not.
        Public Function HasRemainder(ByVal val As Decimal, ByVal div As Integer, Optional Convert As Boolean = False) As Integer
            Dim remainder As Integer = 0

            If Convert Then
                remainder = (Me.ConvertToPennies(val) Mod div)
            Else
                remainder = (val Mod div)
            End If

            Return remainder
        End Function

        ' Convert dollars to cents and make difference positive.
        Private Function ConvertToPennies(ByVal val As Decimal) As Integer
            Return Math.Abs(val * 100)
        End Function

        ' Generates a random number.
        Private Function FindRandom(ByVal floor As Integer, ByVal ceiling As Integer) As Integer
            Static r As New Random()
            Return r.Next(floor, ceiling)
        End Function

        ' Generates a random order.
        Private Function OrderRandom(ByVal list As Integer()) As Integer()
            Static r As New Random()
            Return list.OrderBy(Function(x) r.Next).ToArray()
        End Function

        ' Formats the units so they are displayed properly
        Protected Overridable Function FormatResult(ByVal dollars As Integer, ByVal quarters As Integer, ByVal dimes As Integer, ByVal nickels As Integer, ByVal pennies As Integer) As String
            Dim result As New CommaDelimitedStringCollection()

            If dollars > 0 Then
                result.Add(Me.Pluralize(dollars, "dollar"))
            End If

            If quarters > 0 Then
                result.Add(Me.Pluralize(quarters, "quarter"))
            End If

            If dimes > 0 Then
                result.Add(Me.Pluralize(dimes, "dime"))
            End If

            If nickels > 0 Then
                result.Add(Me.Pluralize(nickels, "nickel"))
            End If

            If pennies > 0 Then
                result.Add(Me.Pluralize(pennies, "penny"))
            End If

            Return result.ToString()
        End Function

        ' Pluralizes the units properly so we don't look grammatically inept.
        Protected Overridable Function Pluralize(ByVal count As Integer, ByVal unit As String) As String
            Dim plural As String = unit & "s"
            If unit = "penny" Then
                plural = "pennies"
            End If

            Select Case count
                Case Is > 1
                    Return String.Format("{0} {1}", count, plural)
                Case 1
                    Return String.Format("{0} {1}", count, unit)
                Case Else
                    Return ""
            End Select
        End Function
#End Region
    End Class
End Namespace