// @ts-check
import http from 'node:http';

const server = http.createServer(async (req, res) => {
  if (
    // in case of opening from browser
    req.url === '/favicon.ico'
    // not a GET request
    || req.method !== 'GET'
  ) {
    res.writeHead(404);
    return res.end();
  }

  // example: http://localhost:58080/{max POW}/{slug to print}/{delay in ms}
  const [, number, slug, delay = undefined] = req.url?.split('/') || [];

  const max = Number(number) ? eval('1e' + number) : 1e1;
  const slugFinal = slug || number;

  console.log(`🚀 ~ server: Starting`, { slug: slugFinal, max, delay });

  const dataGenerator = infiniteData(slugFinal);

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
    // it will sleep between 0 and delay ms
    await Sleep(delay ? Number(delay) : undefined);
    res.write(data);
  }

  console.log(`🚀 ~ server ~ Ending at ${isOpen ? i - 1 : i}`, { slug: slugFinal, max, delay });
  return res.end();
})
  .listen(process.env.PORT || 58080);

function* infiniteData(
  /** @type {string} */ slug,
) {
  // generate random number between 0 and 9
  function randomNumber() {
    return Math.floor(Math.random() * 10);
  }

  while (true) {
    // while this could be an object
    // but we will just use a string
    // to make it easier to parse it
    // split on space and break on \n
    yield `${slug} ${randomNumber()} \n`;
  }
}

/**
 * Force sleep for a random amount of time between 0 and max
 */
const Sleep = (max = 10) => new Promise((res) => {
  setTimeout(() => {
    res(null);
  }, Math.floor(Math.random() * max));
});
