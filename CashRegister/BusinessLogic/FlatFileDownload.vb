Imports System.IO

Namespace BL
    Public Class FlatFileDownload
        Inherits CommonPage

        ' New Instance
        Public Sub New()
        End Sub

        ' New Instance with passed in properties
        Public Sub New(ByVal c As List(Of String), ByVal f As String)
            change = c
            fileType = f
        End Sub

        Private change As New List(Of String)
        Public Property filename As String = String.Format("{0:yyyyMMdd_hhmmsstt}", Now())
        Public Property fileType As String = "txt"

        ' Create flat file for download via browser
        Public Sub DownloadFile()
            If change.Count > 0 Then
                Dim sb As New StringBuilder()

                For Each s As String In change
                    sb.Append(s).AppendLine()
                Next

                HttpContext.Current.Response.Clear()
                HttpContext.Current.Response.ClearHeaders()
                HttpContext.Current.Response.ClearContent()
                HttpContext.Current.Response.AddHeader("content-disposition", String.Format("attachment; filename={0}.{1}", filename, fileType))

                Dim ft As New FileTypes()
                HttpContext.Current.Response.ContentType = ft.ParseMimeType(fileType)
                HttpContext.Current.Response.AddHeader("Pragma", "public")
                HttpContext.Current.Response.Write(sb.ToString())
                HttpContext.Current.Response.End()
            End If
        End Sub
    End Class
End Namespace