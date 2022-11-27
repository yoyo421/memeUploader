# Meme Uploader

Single page app about meme sharing service.

Any user can upload memes to the server for limited time and get a url for them

# Metholagy

This project uses:

- yarn berry 3.3.0 pnp
- vite: bundle manager
- expressjs as the server
- react as the framework
- fs to read & write image files and json storage

Rasons:

- yarn (berry): I like it and wanted to get familier with berry because I
  acutally didnt know it was exists until 2 weeks ago
- vite: feel refresh to use something other then webpack and really fast
  lacks little docs
- expressjs: really basic and well documented, I thought maybe to use alts
  but I feel I didnt mastered it yet (why reading files must be with external library???)
- react: Loving it ❤️
- fs: the basic and code file system library for nodejs, i thought to use
  prisma, but it was too overkill for this project

# How To Use

This project require the use of `yarn` because of the workspace feature.

> (Yarn will autommatically detect berry within the project)
> (Typescript & PNP has some trouble working together, if you encounter any typescript errors please check that: `arcanis.vscode-zipfs` extension for vscode is installed)

First you need to install the project packages, run

```sh
yarn install
```

Then to run the following command to start the dev server, you can use `-p` to change the port (default to 5000)

```sh
yarn dev
```

To test the project (mainly the file logic) run the test command, you can add `--verbose` to see what is being tested

```sh
yarn test --verbose
```

To build the project the following command, it will build both vite for client and expressjs for server

```sh
yarn build
```

To serve the built project, run:

```sh
yarn serve
```
