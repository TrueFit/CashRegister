Imports System.IO

Namespace BL
    Public Class FlatFileUpload
        Inherits CommonPage

        ' New Instance
        Public Sub New()
        End Sub

        ' New Instance with passed in properties
        Public Sub New(ByVal f As FileUpload, ByVal d As Char, ByVal h As Boolean)
            fu = f
            delim = d
            hasHeader = h
        End Sub

        Private dt As New DataTable()
        Public Property fu As FileUpload = Nothing
        Public Property delim As Char = CChar(",")
        Public Property hasHeader As Boolean = False
        Public Property acceptableTypes As String = "txt,csv"

        ' Uploads a temporary file to the server so we can work with it.
        Public Function UploadFile() As DataTable
            Dim filename As String = Path.GetTempFileName()

            If fu.PostedFile IsNot Nothing AndAlso fu.PostedFile.ContentLength > 0 Then
                fu.PostedFile.SaveAs(filename)
            Else
                _message.Append("Please choose a file to import.")
                Return Nothing
            End If

            Dim ft As New FileTypes()
            Dim allowed As List(Of String) = ft.ParseMimeTypes(acceptableTypes)
            If Not allowed.Contains(fu.PostedFile.ContentType) Then
                _message.Append(String.Format("Please choose a file with the appropriate file type. ({0})", acceptableTypes))
                Return Nothing
            End If

            If File.Exists(filename) Then
                dt = ImportFlatFile(filename, delim, hasHeader)
                If dt.Rows.Count > 0 Then
                    Return dt
                Else
                    _message.Append("File uploaded successfully, but no data was retrieved.")
                    Return Nothing
                End If
            Else
                _message.Append("File Import Error. Failed to create temporary file.")
                Return Nothing
            End If
        End Function

        ' Reads the imported file and pushed the data into a DataTable for easier iteration
        Private Function ImportFlatFile(ByVal filename As String, ByVal delimiter As Char, Optional ByVal hasHeaderRow As Boolean = False) As DataTable
            Dim dt As New DataTable()
            Dim line As String = Nothing
            Dim i As Integer = 0

            Using sr As StreamReader = File.OpenText(filename)
                line = sr.ReadLine()

                Do While line IsNot Nothing
                    Dim data() As String = line.Split(delimiter)
                    If data.Length > 2 Then
                        _message.Append("File Import Syntax Error. 1 owed/paid pair per line.")
                        Exit Do
                    End If

                    If i = 0 Then
                        If data IsNot Nothing AndAlso data.Length > 0 Then
                            If hasHeaderRow Then
                                For Each item In data
                                    dt.Columns.Add(New DataColumn(item))
                                Next
                            Else
                                For Each item In data
                                    dt.Columns.Add(New DataColumn())
                                Next

                                Dim row As DataRow = dt.NewRow()
                                row.ItemArray = data
                                dt.Rows.Add(row)
                            End If
                            i += 1
                        Else
                            Exit Do
                        End If
                    Else
                        If data IsNot Nothing AndAlso data.Length = dt.Columns.Count Then
                            Dim row As DataRow = dt.NewRow()
                            row.ItemArray = data
                            dt.Rows.Add(row)
                        End If
                    End If

                    line = sr.ReadLine()
                Loop
            End Using

            Return dt
        End Function
    End Class
End Namespace