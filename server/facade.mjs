// @ts-check
import http from 'node:http';

let isOpen = true;

// const BASE_URL = (/** @type {number} */ n) => `http://localhost/api/${n}`;
const BASE_URL = (/** @type {number} */ n) => `http://instance${n}:58080/${n}`;

const getUrl = (
  /** @type {number} */ api,
  /** @type {string} */ size,
  /** @type {string} */ delay
) => {
  const url = new URL(`${BASE_URL(api)}/${size}/${delay}`);
  return url.toString().replace(/\/+$/, '');
};

http.createServer(async (req, res) => {
  // set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');

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
    // example: http://localhost/api/0/{quantity|speed}/{value +-}
    const [, keyReq, valueReq] = req.url?.split('/') || [];

    res.setHeader('Content-Type', 'application/json');

    if (!isOpen) {
      res.statusCode = 200;
      return res.end(JSON.stringify(false));
    }

    const results = await Promise.all(Array
      .from({ length: 9 }, (_, i) => i + 1)
      .map((api) => {
        return fetch(`${BASE_URL(api)}/${keyReq}/${valueReq}`, {
          method: 'POST',
        }).then((res) => res.json());
      })
    );

    res.statusCode = 200;
    return res.end(JSON.stringify(results));
  }

  // example: http://localhost:58080/{max POW}/{delay in ms}
  const [, size = '1', delay = '100'] = req.url?.split('/') || [];

  console.log(`🚀 ~ server: Starting`, { size, delay });

  isOpen = true;
  const controller = new AbortController();

  req.on('close', () => {
    isOpen = false;
    controller.abort('connection closed');
    console.log('connection closed');
  });

  // you can call directly on browser to see it streaming data in real time!
  res.writeHead(200, { 'Content-Type': 'text; charset=utf-8' });

  const { signal } = controller;
  const decoder = new TextDecoder('utf-8');

  // making each instance counter separated as to not have racing issues
  const count = /** @type {Record<1|2|3|4|5|6|7|8|9, number>} */(Object.fromEntries(
    Array.from({ length: 9 }, (_, i) => [i + 1, 0])
  ));

  await Promise.all(
    Array.from({ length: 9 }, (_, i) => {
      const api = i + 1;
      return fetch(getUrl(api, size, delay), {
        signal
      })
        .then(async (fRes) => {
          console.log(`🚀 ~ facade ~ fetch ~ ${api}`);
          const reader = fRes.body?.getReader();
          if (!reader) {
            return;
          }

          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();

            if (done || signal.aborted || !isOpen) {
              reader.cancel(signal.reason);
              break;
            }

            if (value) {
              buffer = buffer + decoder.decode(value);

              while (true) {
                const index = buffer.indexOf('\n');
                if (index === -1) {
                  break;
                }
                const chunk = buffer.substring(0, index + 1);
                count[api] += 1;

                res.write(chunk);
                buffer = buffer.substring(index + 1);
              }
            }
          }
        })
        .catch((e) => {
          console.log(`🚀 ~ facade ~ fetch ${api} ~ error:`, e);
        });
    })
  );

  const finalCount = Object.values(count).reduce((a, b) => a + b, 0);
  const maxPossibleValues = 9 * Number(eval('1e' + size));

  console.log(`🚀 ~ facade ~ Ending at ${finalCount}/${maxPossibleValues}`, { size, delay });

  return res.end();
})
  .listen(process.env.PORT || 58080, () => {
    console.log(`🚀 ~ facade ~ listening on port ${process.env.PORT || 58080}`);
  });
