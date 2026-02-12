USE [CashRegister]
GO
SET IDENTITY_INSERT [dbo].[Currencies] ON 
GO
INSERT [dbo].[Currencies] ([Id], [Name]) VALUES (1, N'USD')
GO
INSERT [dbo].[Currencies] ([Id], [Name]) VALUES (2, N'EURO')
GO
SET IDENTITY_INSERT [dbo].[Currencies] OFF
GO
SET IDENTITY_INSERT [dbo].[Denominations] ON 
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (1, N'pennies', 1, 1)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (2, N'nickles', 5, 1)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (3, N'dimes', 10, 1)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (4, N'quarters', 25, 1)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (5, N'half dollars', 50, 1)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (6, N'dollars', 100, 1)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (7, N'2 dollars', 200, 1)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (8, N'5 dollars', 500, 1)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (9, N'10 dollars', 1000, 1)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (11, N'20 dollars', 2000, 1)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (12, N'50 dollars', 5000, 1)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (13, N'100 dollars', 10000, 1)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (14, N'1 cent', 1, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (15, N'2 cent', 2, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (16, N'5 cent', 5, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (17, N'10 cent', 10, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (18, N'20 cent', 20, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (19, N'50 cent', 50, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (20, N'1 euro', 100, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (21, N'2 euros', 200, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (22, N'5 euros', 500, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (23, N'10 euros', 1000, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (25, N'20 euros', 2000, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (26, N'50 euros', 5000, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (27, N'100 euros', 10000, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (28, N'200 euros', 20000, 2)
GO
INSERT [dbo].[Denominations] ([Id], [Name], [Value], [CurrencyId]) VALUES (29, N'500 euros', 50000, 2)
GO
SET IDENTITY_INSERT [dbo].[Denominations] OFF
GO
SET IDENTITY_INSERT [dbo].[Settings] ON 
GO
INSERT [dbo].[Settings] ([Id], [CurrencyId]) VALUES (1, 1)
GO
SET IDENTITY_INSERT [dbo].[Settings] OFF
GO
SET IDENTITY_INSERT [dbo].[Rules] ON 
GO
INSERT [dbo].[Rules] ([Id], [Name], [Enabled], [RuleTarget], [RuleType], [ModValue]) VALUES (1, N'Divisible3', 1, 1, 0, 3)
GO
SET IDENTITY_INSERT [dbo].[Rules] OFF
GO
