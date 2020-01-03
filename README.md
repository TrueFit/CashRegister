# Cash Register

## Overview

Solving the challenge as detailed in https://github.com/truefit/cashregister.

## Technologies

### Language

-   JavaScript (node v12.2.0)
-   es.next features transpiled for the current node version with [Babel](https://babeljs.io/)

### Code Quality

-   [Prettier](https://prettier.io/)
-   [ESLint](https://eslint.org/)
-   [Husky](https://github.com/typicode/husky) pre-commit hook to check staged files against linting standards prior to commit

### Commands

Run in dev mode (with input file specified):

```
$ npm run dev -- --inputFile=src/in.txt
```

Run for production:

(babel-node/on the fly transpilation is not recommended for non-dev environments; this command will precompile into `dist/`)

```
$ npm run start -- --inputFile=src/in.txt
```

### CLI Options

CLI options should be preceded with a `--` and can be passed in after `npm run start --`.

| -- | -- | -- |
| Option | Description | Required? |
| inputFile | File of entries to consume | Yes |
| currency | The currency ID from `src/constants/currency.js` to use | No, defaults to 'usd' |
| divisor | Random twist divisor | No, defaults to 3 |
| outputFile | File where contents will be written | No, defaults to src/out.txt |

Examples:

```
$ npm run start -- --inputFile=src/in.txt --divisor=2
```
