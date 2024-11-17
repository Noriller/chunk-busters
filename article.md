# Who You Gonna Stream? Chunk-busters!

![cover img](https://miro.medium.com/v2/resize:fit:828/format:webp/1*mLdMbrF9SPlZTGAjgBzX_Q.png)

<aside>
⚠️

If you have photosensitivity, you probably want to skip this.
See the static image below, those lights will start blinking real fast!

</aside>

![example](https://miro.medium.com/v2/resize:fit:828/format:webp/1*kf_5MvtBP80kcJkJdZ9-oA.png)

## How does the internet work?

Remember the title… we are talking about streams here.

I could talk about protocols, packets, ordering, acks, and nacks… but we are talking about streams here, and as you probably guessed right (I believe in you =D) with streams… it’s either binary or strings.

Yes, strings are zipped before being sent… but for what we usually care about in front and backend development… strings and binary.

In the following examples, I’ll be using JS streams.

While Node has its own legacy implementations, we have ways to deal with streams that are the same code, be it in the front or back.

Other languages have their way of dealing with streams, but as you’ll see… the actual code part of dealing with it was not that complicated (not to say there aren’t complex things happening).

## The example problem

You have a frontend that has to consume data from multiple sources.

While you could access each source individually via its IP/port, you put them behind an API Gateway for ease of use and control.

### The Repo

Check the repo at the link, there learn how to run it yourself so you can play with it.

https://github.com/Noriller/chunk-busters

### v0 - the naive implementation

You have the sources, you `fetch`, wait, and render. Rinse and repeat.

```tsx
await fetch1();
handleResult(1);
await fetch2();
handleResult(2);
...
await fetch9();
handleResult(9);
```

You might be thinking that no one will actually do that…

In this example, it's clear that something is wrong, but it’s not that hard to fall into this.

The obvious: it’s slow. You have to fire and wait for each request and if it’s slow… you have to wait.

![v0](https://miro.medium.com/v2/resize:fit:640/format:webp/1*t50P3RCMPoogm1w5nNPoaQ.gif)

### v1 - the eager version

You know you don’t want to wait for each request individually… so you fire all and then wait for them to complete.

```tsx
await Promise.all([
  fetch1(),
  fetch2(),
  ...
  fetch9(),
]);
handleAllResults(results);
```

This is what you probably do, so it’s good right?

I mean, except if you have ONE single request being slow… this would mean that even if all the others are already done… you still would have to wait that one to complete.

![v1](https://miro.medium.com/v2/resize:fit:640/format:webp/1*sCQq3bR-CBWxR5inwBMNag.gif)

### v2 - the smarter, eager, version

You know you might have some requests that are slower, so you still fire all and wait, but as they come you already do something with the result when possible, so when the last one arrives, the others are already done.

```tsx
await Promise.all([
  fetch1().then(handleResult),
  fetch2().then(handleResult),
  ...
  fetch9().then(handleResult),
]);
```

This HAS to be the best solution right?

![v2](https://miro.medium.com/v2/resize:fit:640/format:webp/1*KqFZrXsTtOJE9_shel2eKw.gif)

Hmm… something weird?

### v3 - I was lying to you… this is what v1 should look like

Remember v1? Yeah… this is what it should look like:

![v3](https://miro.medium.com/v2/resize:fit:640/format:webp/1*0y6XB3NWTamoXKOxYnjEWg.gif)

Turns out there’s a limit to how many connections you can have with the exact same endpoint in http/1 and not only that… it’s browser dependant and each browser might have different limits.

You might think to just use http/2 and call it a day… but even if this was a good solution, you still have to deal with multiple endpoints in the frontend.

Is there even a good solution for this?

### v4 - enter streams!

Let’s revisit `v0` but using streams…

![v4](https://miro.medium.com/v2/resize:fit:640/format:webp/1*rgB7zRwYu5ZeM0BLVbEqTQ.gif)

You’re smart, so you were probably expecting this since the warning spoiled it a little… but yeah… what you were seeing before was not all the data that the backend was generating.

Anyway… as we fetch we render.

```tsx
// usually we do this:
await fetch(...).then((res) => {
  // this json call accumulate all the response
  // that later is returned for you to use
  return res.json()
})
```

If we instead tap on the stream coming, we can do something with the chunks of data as it comes. (Yes! Like Chat GPT and the like do.)

Even if v0 is the worst way of handling this problem, it’s greatly improved by using streams. You can trick the user by showing something, anything, even if the total wait time is the same.

### v5 - v1, again, but with streams!

The http/1 problem is still an issue, but again, you can already see things as they come.

![v5](https://miro.medium.com/v2/resize:fit:640/format:webp/1*mER6EX0NT-dstjGaMfuBtg.gif)

Yeah… I can’t stall this anymore… so…

### v6 - **one API to rule them all!**

Or… maybe I can?

You see, the frontend had to manage too much… if we can offload that to the backend, then you can have one endpoint that will handle all the sources.

This solves complexity on the frontend and http/1 issues.

```tsx
await fetchAll();
handleAllResults(results);
```

![v6](https://miro.medium.com/v2/resize:fit:640/format:webp/1*CJF3IULzm77COwQn68uHxg.gif)

```tsx
// if you had already offloaded to the backend,
// then you might had data like
{
  data0: [...],
  data1: [...],
  ...
  data9: [...],
}
// since the backend would be doing the fetch
// waiting ALL the data and then sending to the front

// in this case, however...
[
  { from: 'data9', ... },
  { from: 'data1', ... },
  { from: 'data1', ... },
  { from: 'data0', ... },
  ...
  { from: 'data1', ... },
]
// The backend will stream from the sources,
// it will handle, parse, do something with each,
// then send it to the front
// the order is not guaranteed, it will be out of order
// between the sources and you need to add something
// to know which source sent each piece
// but you can receive piece by piece as it's generated
// and handle them accordingly
```

### v7 - and finally… one API, multiple sources, and streaming.

We call one API, that will call all the sources, stream the data, handle it, and pass it to the front that will, in turn, render the data as it comes.

The code used for this is basically the same on both front and back:

```tsx
// in both frontend and backend we can use the same `fetch` api
fetch(url, {
  // we use the AbortController to cancel the request
  // if the user navigates away (or if connection is closed)
  signal,
}).then(async (res) => {
  // instead of the "normal" `res.json()` or `res.text()`
  // we use the body of the response
  // and get the reader from the body
  // this is a `ReadableStream`
  // (there are other types of streams and ways to consume them)
  const reader = res.body?.getReader();
  if (!reader) {
    return;
  }

  // remember we are "low level" here
  // streams can be strings or binary data
  // for this one we know it's a string
  // so we will accumulate it in a string
  let buffer = '';

  // let's read until the stream is done
  while (true) {
    const { done, value } = await reader.read();

    // if the stream is done (or the user aborted)
    if (done || signal.aborted) {
      // cancel the stream, exit the loop
      reader.cancel(signal.reason);
      break;
    }

    // if we have a value
    if (value) {
      // decode and add to the buffer
      buffer = buffer + new TextDecoder().decode(value);

      // here is where the magic happens!
      // we check if we can consume something from the buffer
      if (canConsumeSomething(buffer)) {
        // value above might be half or double of one "chunk"
        // so, we need to slice what we can consume
        // the if above might be changed to a "while"
        // or the chunk below might be "multiple"
        // consumable values... it all depends on how
        // you will use it.
        const [chunk, remaining] = consumeSomething(buffer);

        // in the frontend, make it render the chunk
        // (in react, we can simply update the state
        // and let react handle the rerendering based on that)
        renderChunk(chunk);
        // in the backend... send the response
        // we can always parse, transform before that
        // but the back will probably either send to the
        // frontend, another service or to a DB.
        sendResponse(chunk);

        // and then we update the buffer
        buffer = remaining;
      }
    }
  }
});
```

Yes… that's it (as the most basic and easy example goes).

We add the string coming to a `buffer`, parse it, check if there’s a usable `chunk`, use it, and forget it. This means you could receive/consume TBs of data… one chunk at a time, with little RAM.

![v7](https://miro.medium.com/v2/resize:fit:640/format:webp/1*DstvJ5SBenXrTA0W2TUr2g.gif)

I know what you’re thinking… and it’s stupid… it’s also madness…

> MOOOOOOOM I want Websockets!
>
> No sweetheart, we have websockets at home!
>
> Websockets at home: next?

### v8 - it’s only stupid if it doesn’t work

You’re smart, you thought that if the source is still generating data… then maybe we could update some variables…

This way you can keep the one connection being used to get more data or change something from what it’s generating.

Yes… I guess you could do that… and I did the example on your insistence. =D

Still… it’s a stupid idea, I don’t know where/if it can be used in a real production environment. Maybe if you travel back in time to that awkward JS phase between MPA and Ajax where you had enough interactivity, but not enough connections to the same server (some browsers had a limit of only 2!) then maybe?

Aside from that, no idea. If you do have… let me know.

![v8](https://miro.medium.com/v2/resize:fit:640/format:webp/1*Jk2E5Q63CO4TlJZ1OM7KTA.gif)

In the example above, attention to the center board, especially the "progress border": you can see that one keeps updating. If you opened the network tab you would see that the `GET` connection is never closed before the end. You would also see multiple other requests that change what that one, still alive, connection was doing… all of that with `vanilla http/1`.

## What’s next?

### String vs JSON

This example is the most basic I could make. I’m even using simple strings instead of JSON since it’s easier to parse.

To use JSON, you have to accumulate the string (we do have to `JSON.stringify` the backend response for a reason).

Then either check where to break it and then parse that value or parse as you go.

For the first one, think NDJSON: instead of a JSON array, you separate the objects with new lines, then you could “more easily” find where to break, then `JSON.parse` each and use the object.

For the latter, you parse as you go as in: you know you’re in an array, now it’s an object, ok first key, now it’s the value of the key, next key, skip that, next key… and so on and on… it’s not something trivial to make manually, but it’s like the jump from the `await then render` to the `render as you await` this is all about… except… on an even smaller scale.

### Error Handling

People like to host examples, this one you need to run yourself… I hope the reason for not hosting the example somewhere is clear now, but another one is that we don’t expect any error here, and if you were to add network errors above everything else… well…

Errors should be handled, but they do add another layer of complexity.

## Should you be using it?

Maybe… you can say it *depends*…

There are places where streaming is the answer but in most cases… `await json` is enough (not to mention easier).

But learning about streams opens up ways to solve some problems, be it in the frontend or the backend.

In the frontend, you can always use this to “trick” the user. Instead of showing spinners everywhere, you can show something as it comes and then show more as it comes, even if it takes a while. As long as you don’t block the user from interacting with it… you can even make something that is “slower” than just showing spinners *feel* like it’s way faster than anything *actually* faster.

In the backend, you can save up on RAM since you can just parse each chunk of data as it comes, be it from the front, a database, or anything else in between. Handle the data as needed, and send it without having to wait for the entire payload that would make it throw an OOM (Out of Memory) Error. GBs or even TBs of data… sure, why not?

## Outro

Is React slow? This whole example frontend was done with React and aside from the “main” thing going on with all the blinking “lights”, there’s a lot of other stuff going on.

Yes… if you go fast enough the example can’t keep up and start freezing. But since it’s easily thousands of renderings going on per minute… I do think it’s enough for most applications.

And, you can always improve performance: for the “progress border”, I’ve used deferred values to make it smoother if you need to save some in renderings… I could done this and other performance enhancements for the “lights“ and the title, but it would just make the “lights” stop blinking a lot of the time (which wouldn’t make a nice demo), and also the “electric” underline in the title wouldn’t be as fun as it is.

In this example, all those “improvements” wouldn't be ideal, but for normal applications... you can make it handle a lot. And if you do need something more, then in this case use another solution.

## Conclusion

Add streams to your arsenal… it might not be a panacea solution, but it surely will come in handy someday.

And if you’re gonna do something with it and want help, well… maybe give me a call. =P
