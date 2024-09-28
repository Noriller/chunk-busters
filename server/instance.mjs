// @ts-check
import http from 'node:http';

let MAX_SIZE = 0;
let DELAY = /** @type {number|undefined} */(undefined);
let GENERATED = 0;
let isOpen = true;

const getShouldStop = (n = GENERATED) => !isOpen || n > MAX_SIZE;

http.createServer(async (req, res) => {
  // set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (
    // in case of opening from browser
    req.url === '/favicon.ico'
    // not a GET/POST request
    || !['GET', 'POST'].includes(/** @type {string} */(req.method))
  ) {
    res.writeHead(404);
    return res.end();
  }

  console.log(`🚀 ~ instance ~ req`, { method: req.method, url: req.url });

  if (req.method === 'POST') {
    // example: http://localhost:58080/{api}/{quantity|speed}/{value +-}
    const [, , keyReq, valueReq] = req.url?.split('/') || [];

    const key = /** @type {'quantity' | 'speed'} */(keyReq);
    const value = Number(valueReq);

    res.setHeader('Content-Type', 'application/json');

    if (key === 'quantity') {
      if (getShouldStop()) {
        res.statusCode = 200;
        return res.end(JSON.stringify(false));
      }

      const newMax = MAX_SIZE + value;
      MAX_SIZE = newMax < 0 ? 0 : newMax;

      console.log(`🚀 ~ http.createServer ~ MAX_SIZE:`, MAX_SIZE)

      res.statusCode = 200;
      return res.end(JSON.stringify(true));
    }

    const newDelay = (DELAY ?? 0) + value;
    DELAY = newDelay < 2 ? 1 : newDelay;

    console.log(`🚀 ~ http.createServer ~ DELAY:`, DELAY)

    res.statusCode = 200;
    return res.end(JSON.stringify(true));
  }

  // example: http://localhost:58080/{slug to print}/{max POW}/{delay in ms}
  const [, slug, number = 1, delayReq = undefined] = req.url?.split('/') || [];

  DELAY = Number(delayReq);
  MAX_SIZE = Number(number) ? eval('1e' + number) : 1e1;

  console.log(`🚀 ~ instance: Starting`, { slug, max: MAX_SIZE, delay: DELAY });

  const dataGenerator = infiniteData(slug);

  isOpen = true;
  req.on('close', () => {
    isOpen = false;
    console.log('connection closed');
  });

  // you can call directly on browser to see it streaming data in real time!
  res.writeHead(200, { 'Content-Type': 'text; charset=utf-8' });

  GENERATED = 0;

  for await (const [n, data] of dataGenerator) {
    if (getShouldStop(n)) {
      break;
    }
    // keep how many items we have generated
    GENERATED = n;

    // some random delay is added to simulate real conditions
    // of generating/retrieving data
    // it will sleep between delay ms +/- 50%
    await Sleep(DELAY ?? undefined);
    res.write(data);
  }

  console.log(`🚀 ~ instance ~ Ending at ${GENERATED}`, { slug, max: MAX_SIZE, delay: DELAY });
  return res.end();
})
  .listen(process.env.PORT || 58080, () => {
    console.log(`🚀 ~ instance ~ listening on port ${process.env.PORT || 58080}`);
  });

function* infiniteData(
  /** @type {string} */ slug,
) {
  let i = 0;

  const extraPadding = 'this thing is just to make each piece of data bigger '.repeat(100);

  while (true) {
    // while this could be an object
    // but we will just use a string
    // to make it easier to parse it
    // split on space and break on \n
    yield /** @type {const} */([++i, `${slug} ${randomNumber()} ${extraPadding} \n`]);
  }
}

// generate random number between 0 and 9
function randomNumber() {
  return Math.floor(Math.random() * 10);
}

const randomBetween = (/** @type {number} */ min, /** @type {number} */ max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Force sleep for a random amount of time between +/- 50% of max
 */
const Sleep = (max = 10) => new Promise((res) => {
  setTimeout(() => {
    res(null);
  }, randomBetween(max * 0.5, max * 1.5));
});
