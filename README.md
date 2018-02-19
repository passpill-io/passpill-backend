# Passpill backend

This is part of the [PassPill project](https://passpill.io/?stay), that aims to share the whole development of a software project. This repo contains the back end for the password manager PassPill.

It's great that you are interested in this app's source code. You are welcome to fork the repo, install it locally and start to play with the code.

## What's inside this repo?
The backend is very simple, it provides an API to store and retrieve the encrypted data, AKA the pill.

This repository contains the JavaScript functions to return and store the pills. It also contains a very simple Node.js server that offers the API, made using express.js, that the frontend needs to work.

## Local installation
The installation is simple and you can connect the front end that is running at https://api.passpill.io so you can start working with it straight away.

First open your terminal and clone the repo
```
$ git clone https://github.com/passpill-io/passpill-backend.git
```

The you need to install the dependencies
```
$ cd passpill-app
$ npm install
```

And then you have everything ready to run the Node.js server:
```
$ npm start
```

Then the API will be able in your computer at `http://localhost:3333`.

