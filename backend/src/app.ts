import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';

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
  console.log(req.body);
  res.send('OK');
});

export default app;
