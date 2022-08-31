## Prerequisites

- npm

## Setup

1. Clone the repository to your local machine
1. Open a terminal at the `backend` folder
1. Run `npm install`
1. Run `npm run build`
1. Run `npm run start`. You should see `Server is running at https://localhost:8000`
1. Open another terminal tab/window at the `frontend` folder
1. Run `npm install`
1. Run `npm run start`
1. Open a browser tab to `http://localhost:3000/`, if it didn't open automatically

## Usage

To use the app, first select your input file, either by dragging and dropping or by clicking "Browse files" to bring up the file explorer. Once a file is selected, click "Calculate Change". The result will be displayed on the screen. Click "Download Output File" to get the output file (output.txt). If you want to calculate change for another input file, click "Select Another File".

## Testing

### Backend

To run the backend unit tests, open a terminal to the `backend` folder and run `npm run test`.

### Frontend

To run the frontend unit tests, open a terminal to the `frontend` folder and run `npm run test`.
