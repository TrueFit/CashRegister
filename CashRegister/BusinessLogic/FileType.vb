Namespace BL
    Public Class FileTypes
        Inherits CommonPage

        ' New Instance
        Public Sub New()
        End Sub

        ' Associate .txt with text/plain mime
        Public ReadOnly Property txt As String
            Get
                Return "text/plain"
            End Get
        End Property

        ' Associate .csv with text/csv mime
        Public ReadOnly Property csv As String
            Get
                Return "text/csv"
            End Get
        End Property

        ' Return the mime associated with the ext
        Public Function ParseMimeType(ByVal ext As String) As String
            Select Case ext
                Case "txt"
                    Return Me.txt
                Case "csv"
                    Return Me.csv
                Case Else
                    Return ""
            End Select
        End Function

        ' Return a list of mimes based on inputed comma delimited list of allowed extensions
        Public Function ParseMimeTypes(ByVal allowed As String) As List(Of String)
            Dim mimes As New List(Of String)

            For Each m As String In allowed.Split(CChar(",")).ToList()
                mimes.Add(Me.ParseMimeType(m))
            Next

            Return mimes
        End Function
    End Class
End Namespace