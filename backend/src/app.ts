import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Request, Response } from 'express';

import { getChangeResponse } from './cashregister';

const app = express();

app.use(bodyParser.text({
  defaultCharset: 'utf-8',
  type: 'text/plain',
}));

app.set('port', process.env.PORT || 3000);

app.get('/status', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.post('/calculate-change', (req: Request, res: Response) => {
  if (req.body == null) {
    res.sendStatus(500);
    return;
  }
  try {
    res.send(getChangeResponse(req.body));
  }
  catch (e) {
    console.log('Error handling request:', e);
    if (e instanceof TypeError) {
      res.status(400).send(e.message);
    }
    else {
      res.sendStatus(500);
    }
  }
});

export default app;
