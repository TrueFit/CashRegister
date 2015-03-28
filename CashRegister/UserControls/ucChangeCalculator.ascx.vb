Public Class ucChangeCalculator
    Inherits System.Web.UI.UserControl

    Public Property Delimiter As Char = CChar(",")
    Public Property HasHeaderRow As Boolean = False
    Public Property RandomDivisors As String = "3"
    Public Property AcceptableTypes As String = "txt,csv"
    Private dt As New DataTable()

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

    End Sub

    Protected Sub btnUpload_Click(ByVal sender As Object, ByVal e As EventArgs) Handles btnUpload.Click
        If Session("ChangeOutput") IsNot Nothing Then
            Session("ChangeOutput") = Nothing
        End If

        Dim ffu As New BL.FlatFileUpload(fuTransactions, Delimiter, HasHeaderRow)
        dt = ffu.UploadFile()

        If ffu.Message <> "" Then
            ltMessage.Text = ffu.Message
        End If

        If dt IsNot Nothing Then
            Dim result As New List(Of String)
            Dim cc As New BL.ChangeCalculator()
            Dim trans As List(Of BL.ChangeRows) = cc.CreateQueue(dt)

            For Each cr As BL.ChangeRows In trans
                Dim changeTotal As Decimal = cc.CalculateChange(cr.owed, cr.paid)
                Dim remainder As Integer = 0
                Dim change As String

                For Each i As String In RandomDivisors.Split(CChar(","))
                    If IsNumeric(i) Then
                        remainder = cc.HasRemainder(cr.owed, i, True)
                    End If
                Next

                If remainder <> 0 Then
                    change = cc.CalculateBest(changeTotal)
                Else
                    change = cc.CalculateRandom(changeTotal, 1)
                End If

                If Not String.IsNullOrWhiteSpace(change) Then
                    result.Add(change)
                End If
            Next

            Session("ChangeOutput") = result
            rptResult.DataSource = result
            rptResult.DataBind()

            phDownload.Visible = True

            If cc.Message <> "" Then
                ltMessage.Text = cc.Message
            End If
        End If
    End Sub

    Protected Sub btnDownload_Click(ByVal sender As Object, ByVal e As EventArgs) Handles btnDownload.Click
        Dim change As New List(Of String)
        If Session("ChangeOutput") IsNot Nothing Then
            change = Session("ChangeOutput")
        End If

        If change.Count > 0 Then
            Dim fd As New BL.FlatFileDownload(change, "txt")
            fd.DownloadFile()
        End If
    End Sub
End Class