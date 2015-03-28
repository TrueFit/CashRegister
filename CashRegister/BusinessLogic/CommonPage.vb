Namespace BL
    Public Class CommonPage
        Inherits System.Web.UI.Page

        ' So we bubble messages to the surface
        Protected _message As New StringBuilder()
        Public ReadOnly Property Message As String
            Get
                Return _message.ToString()
            End Get
        End Property
    End Class
End Namespace