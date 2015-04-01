<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CashRegister.aspx.cs" Inherits="rwkraemer.Professional.CashRegister" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Creative Cash Draw Solutions - Register</title>
    <style>
        h1 { text-align: center; }
        h3 { font-size: small; text-align: justify; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <h1>Cash Register FUN</h1>
        <h3>Please upload the flat file containing each transaction on a separte line, each line being the amount owed then the amount paid seperated by a comma.</h3>
        <asp:FileUpload ID="fuTransactions" runat="server" onchange="this.form.submit()" Width="83px"  />
        <br /><br />
        <asp:Label ID="lblChange" runat="server" />
    </div>
    </form>
</body>
</html>
