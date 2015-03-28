<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="ucChangeCalculator.ascx.vb" Inherits="CashRegister.ucChangeCalculator" %>

<style type="text/css">
    .lb-result { width: 400px; height: 250px;}
    .msg { color: red; }
</style>
<h1>
    Creative Cash Draw Solutions
</h1>
<p>
    Please upload a plain text file with a list of amount paid/amound owed pairs. <a href="/docs/example_transactions.txt" target="_blank">Example file</a>.
</p>
<p>
    <asp:FileUpload ID="fuTransactions" runat="server" onchange="showUploadBtn();" onclick="showUploadBtn();" />
    <asp:Button ID="btnUpload" runat="server" Text="Import File" />
</p>
<p class="msg">
    <asp:Literal ID="ltMessage" runat="server" />
</p>
<p>
    <asp:Repeater ID="rptResult" runat="server" ItemType="System.String">
        <ItemTemplate>
            <%# Item.ToString()%><br />
        </ItemTemplate>
    </asp:Repeater>
</p>
<asp:PlaceHolder ID="phDownload" runat="server" Visible="false">
    <p>
        <asp:Button ID="btnDownload" runat="server" Text="Download Result" />
    </p>
</asp:PlaceHolder>
<script type="text/javascript">
    function showUploadBtn() {
        var i = document.getElementById('<%= fuTransactions.ClientID%>');
        var b = document.getElementById('<%= btnUpload.ClientID%>');

        if ('files' in i) {
            if (i.files.length > 0) {
                b.style.display = 'inline-block';
            } else {
                b.style.display = 'none';
            }
        }
    }
    showUploadBtn();
</script>