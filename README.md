## Cash Register

The Cash Register application is a web interface which interacts with a REST API endpoint to provide the change due to the customer. The system imports a CSV flat file. The flat file must contain two ammounts (ammount owed and ammount tendered) per row. After uploading a document, the API recieves the data and returns a list of currency to return to the customer in the most efficient method. The Cash Register app will allow end users to select if the payment is in USD or EUR as welll as if the change will be provided to the customer in USD or EUR.

- [x] CSV File Uploader
- [x] Currency Exchange Settings
- [x] Output most efficient change due from transaction
- [x] Configurable special case - If amount due is divisible by 3 - random change
- [x] Write output to screen & allow export
- [x] System able to be used as part of larger code base
  - API Calls
  - Call Python Classes directly
- [x] Example adding new special requests (**exclude fives**)

## Motivation

Creative Cash Draw Solutions is a client who wants to provide something different for the cashiers who use their system. The function of the application is to tell the cashier how much change is owed, and what denominations should be used. In most cases the app should return the minimum amount of physical change, but the client would like to add a twist. If the "owed" amount is divisible by 3, the app should randomly generate the change denominations (but the math still needs to be right :))

## Screenshots

![picture alt](https://dgpdev.com/images/projects/cashRegister/cashregister.gif)

## Tech/framework used

The Cash Register application was built using a React front end & a Django backend. I utilized Django Rest Framework to provide an API endpoint. The decision to use Django + Django Rest Framework was made to allow extensibility in the future.

**Built with**

- [React](https://reactjs.org/)
- [Django](https://www.djangoproject.com/)
- [Django Rest Framework](https://www.django-rest-framework.org/)
- [Python](https://www.python.org/)
- [Material-UI](https://material-ui.com/)

## Features

- CSV File Importer / Exporter
- Rest API for extensibility
- USD & EUR currency options with exchange between the two
- Selectable 'special case' functions

## Installation

TODO - Review & Test
Provide step by step series of examples and explanations about how to get a development envrunning.

**Pre-Reqs**

- Python3
- PIP
- NPM

1. Clone Project
2. Create & activate virtual environment for python
3. Install backend
   pip install ./backend/requirements.txt
   cd ./backend
   python manage.py migrate
   python manage.py runserver
4. Install Front end **See backend folder readme**
   cd ./frontend
   npm install
   npm start

## API Reference

This project contains a single API endpoint which allows the POST method and returns the change due for each transaction provided.

**API Endpoint**

         http://localhost:8000/cashregister/API/

**JSON Post Variables**

    - JSON Object
    payment_cc - String - "USD" or "EUR"
    change_cc - String - "USD" or "EUR"
    transactions - Array - [[ ammount owed, ammount due], ]

**JSON Response**

    [{
        "amt_owed": int,
        "amt_tendered": int,
        "change_due": [string]
    }]

## Tests

- TODO

## How to use?

1. Select Payment Country
2. Select Change Country
3. Drag CSV file to drop zone on website
4. View Change Due on website
5. Export CSV File of change due

## Future Enhancements

- [ ] Add jest unit testing
- [ ] Extend python unit tests
- [ ] Error checking on file import
- [ ] Database logging
- [ ] Determine pronunciation for "2 Five Dollar Bills" --> "2 Five Euro Bills"

## Credits

- [Free Currency Converter API](https://free.currencyconverterapi.com/)
- [Dropzone](https://github.com/Yuvaleros/material-ui-dropzone/)

MIT © [David Phenicie](https://dgpdev.com)
