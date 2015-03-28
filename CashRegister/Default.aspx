<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="Default.aspx.vb" MasterPageFile="~/MasterSite.Master" Inherits="CashRegister.SiteIndex" %>
<%@ Register Src="~/UserControls/ucChangeCalculator.ascx" TagName="ChangeCalculator" TagPrefix="uc" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server" />
<asp:Content ID="Content2" ContentPlaceHolderID="content_main" runat="server">
    <uc:ChangeCalculator ID="ucChangeCalculator" runat="server" Delimiter="," HasHeaderRow="false" RandomDivisors="3" AcceptableTypes="txt,csv" />
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="scripts" runat="server" />