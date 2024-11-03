# Chunk-Busters: Don't cross the streams (of data)

You've probably coming here from the article, so let' get started!

If you didn't, check the links below:

## Links

### Article

TODO: links

### Video

TODO: link

## How to Run

You will need Docker installed in an version with the `docker compose` command.

(If you only has the `docker-compose`, then you might need to do some tweaks to the compose files.)

### I just want to see it

Create a `compose.yml` file with the following content then run `docker compose up`.

(If you've cloned this repo, then you can just run `docker compose up` here.)

```yml
# @filename compose.yml
services:
  app:
    image: brunonoriller/chunk-busters-app
    extra_hosts:
      - "host.docker.internal:host-gateway"
    ports:
      - 80:80
    depends_on:
      - facade
  facade:
    image: brunonoriller/chunk-busters-facade
    depends_on:
      - instance1
      - instance2
      - instance3
      - instance4
      - instance5
      - instance6
      - instance7
      - instance8
      - instance9
    restart: unless-stopped
  instance1: &instance-base
    image: brunonoriller/chunk-busters-instance
    restart: unless-stopped
  instance2:
    <<: *instance-base
  instance3:
    <<: *instance-base
  instance4:
    <<: *instance-base
  instance5:
    <<: *instance-base
  instance6:
    <<: *instance-base
  instance7:
    <<: *instance-base
  instance8:
    <<: *instance-base
  instance9:
    <<: *instance-base

```

### I want to play around

You need node (with NVM installed, you can `nvm install && nvm use`), then:

```bash
# install dependencies
npm ci
# run the frontend
npm run dev

# meanwhile run the backend (use another terminal)
npm run service:dev
# OR
# npm run service:dev -- -d
# using the -d flag will run it in detached mode
```

This will allow you to play around with the frontend and backend.

Frontend stuff is mainly in the `src` directory (its based on a simple Vite app).
Backend stuff is in the `server` directory.
