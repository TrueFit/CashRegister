# Cash Register

## Frontend

The frontend is written in React. I used Vite, React Router, and JoyUI to accomplish this.

To get it running run `npm install` in the cash-register-frontend directory
The following librarys should be added

- @emotion/react@11.14.0
- @emotion/styled@11.14.1
- @eslint/js@9.39.2
- @mui/icons-material@7.3.7
- @mui/joy@5.0.0-beta.52
- @mui/material@7.3.7
- @testing-library/jest-dom@6.9.1
- @testing-library/react@16.3.2
- @testing-library/user-event@14.6.1
- @types/node@24.10.13
- @types/react-dom@19.2.3
- @types/react@19.2.13
- @vitejs/plugin-react@5.1.4
- eslint-plugin-react-hooks@7.0.1
- eslint-plugin-react-refresh@0.4.26
- eslint@9.39.2
- globals@16.5.0
- jsdom@28.0.0
- react-dom@19.2.4
- react-router@7.13.0
- react@19.2.4
- typescript-eslint@8.55.0
- typescript@5.9.3
- vite@7.3.1
- vitest@4.0.18

In the .env file update the VITE_API_URL to the correct url for the backend

At this point you should be able to run `npm run dev` and the project will start at `http://localhost:5173`

There is a testFile.csv located in ProjectDocs that provides file for use as needed

If you would like to run the unit tests run `npx vitest`

## Backend

The Backend is written in C#. I created a RestAPI with .NET9 and MSSQL for the database

The following Nuget Packages will have to be installed in order to run

- Microsoft.AspNetCore.OpenApi version 9.0.11
- Microsoft.EntityFrameworkCore version 9.0.13
- Microsoft.EntityFrameworkCore.Design version 9.0.13
- Microsoft.EntityFrameworkCore.InMemory version 9.0.13
- Microsoft.EntityFrameworkCore.SqlServer version 9.0.13
- Microsoft.EntityFrameworkCore.Tools version 9.0.13
- Microsoft.NET.Test.Sdk version 18.0.1
- Moq version 4.20.72
- NUnit version 4.4.0
- NUnit3TestAdapater version 6.1.0

After these packages are installed. The database will need be created and migrated
In the appsettings.json there is DefaultConnection string. Update this to the correct mssql database
Currently it is setup to use the mssqllocaldb which isn't production worthy but good for prototyping like this

In the package management console run `update-database` and it should update the database
At this point the database should be created.

In this ProjectDocs directory there is CashRegisterDatabaseBackup file and CashRegisterDBData.sql.
Either of these will work to restore the data needed to allow the project to work. In the database management tool you can either restore or run the sql script directly.

There are also a unit tests for the backend.

Just to talk about the setup of the backend.
- Controllers handle the exposure of endpoints
- Services handle the business logic and database access
- Models are used for the EntityFramework
- DTOs are used to communicated data to the frontend rather than returning straight entity data
- There are two enums to allow for future Rule Expansion
- Tests are where the unit tests are located.

AI useage: I used github copilot to help with debugging, test writing, and some sections of code generation