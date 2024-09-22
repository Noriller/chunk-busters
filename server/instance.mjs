// @ts-check
import http from 'node:http';

http.createServer(async (req, res) => {
  // set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (
    // in case of opening from browser
    req.url === '/favicon.ico'
    // not a GET request
    || req.method !== 'GET'
  ) {
    res.writeHead(404);
    return res.end();
  }

  console.log(`🚀 ~ server ~ req.url:`, req.url);

  // example: http://localhost:58080/{slug to print}/{max POW}/{delay in ms}
  const [, slug, number = 1, delay = undefined] = req.url?.split('/') || [];

  const max = Number(number) ? eval('1e' + number) : 1e1;

  console.log(`🚀 ~ server: Starting`, { slug, max, delay });

  const dataGenerator = infiniteData(slug);

  let isOpen = true;
  req.on('close', () => {
    isOpen = false;
    console.log('connection closed');
  });

  // you can call directly on browser to see it streaming data in real time!
  res.writeHead(200, { 'Content-Type': 'text; charset=utf-8' });

  let i = -1;
  for await (const data of dataGenerator) {
    if (!isOpen || ++i > max) {
      break;
    }
    // some random delay is added to simulate real conditions
    // of generating/retrieving data
    // it will sleep between delay ms +/- 50%
    await Sleep(delay ? Number(delay) : undefined);
    res.write(data);
  }

  console.log(`🚀 ~ server ~ Ending at ${isOpen ? i - 1 : i}`, { slug, max, delay });
  return res.end();
})
  .listen(process.env.PORT || 58080, () => {
    console.log(`🚀 ~ server ~ listening on port ${process.env.PORT || 58080}`);
  });

function* infiniteData(
  /** @type {string} */ slug,
) {
  // generate random number between 0 and 9
  function randomNumber() {
    return Math.floor(Math.random() * 10);
  }

  const extraPadding = 'this thing is just to make each piece of data bigger '.repeat(100);

  while (true) {
    // while this could be an object
    // but we will just use a string
    // to make it easier to parse it
    // split on space and break on \n
    yield `${slug} ${randomNumber()} ${extraPadding} \n`;
  }
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
