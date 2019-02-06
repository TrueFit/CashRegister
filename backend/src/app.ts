import * as express from 'express';

const app = express();

app.set('port', process.env.PORT || 3000);

app.get('/status', (req: any, res: any) => {
  res.status(200).send('OK');
});

export default app;
