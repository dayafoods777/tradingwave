import { buildServer } from './server.js';

const port = Number(process.env.PORT || 4000);
const host = process.env.API_HOST || '0.0.0.0';

const server = buildServer();

server.listen({ port, host }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`TradingWave API Gateway running at: ${address}`);
});

