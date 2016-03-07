[![Stories in Ready](https://badge.waffle.io/IEEECS-VIT/GPL.png?label=ready&title=Ready)](https://waffle.io/IEEECS-VIT/GPL)
[![Code Climate](https://codeclimate.com/github/IEEECS-VIT/GPL/badges/gpa.svg)](https://codeclimate.com/github/IEEECS-VIT/GPL)
[![Test Coverage](https://codeclimate.com/github/IEEECS-VIT/GPL/badges/coverage.svg)](https://codeclimate.com/github/IEEECS-VIT/GPL/coverage)
[![Issue Count](https://codeclimate.com/github/IEEECS-VIT/GPL/badges/issue_count.svg)](https://codeclimate.com/github/IEEECS-VIT/GPL)
[![Dependency Status](https://david-dm.org/IEEECS-VIT/GPL.svg)](https://david-dm.org/IEEECS-VIT/GPL)
[![devDependency Status](https://david-dm.org/IEEECS-VIT/GPL/dev-status.svg)](https://david-dm.org/IEEECS-VIT/GPL#info=devDependencies)
[![Circle CI](https://circleci.com/gh/IEEECS-VIT/GPL.svg?style=svg)](https://circleci.com/gh/IEEECS-VIT/GPL)
[![Join the chat at https://gitter.im/IEEECS-VIT/GPL](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/IEEECS-VIT/GPL?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

graVITas Premier League
=======================

The graVITas Premier League code repository

This website is hosted at http://gpl.ieeecsvit.com

For exhaustive documentation, check out the project [wiki](https://github.com/IEEECS-VIT/GPL/wiki)

Please report any bugs or issues [here](https://github.com/IEEECS-VIT/GPL/issues)

#### Instructions for Installation:
###### Install the latest edition of Node.js from [here] (https://nodejs.org/en/download/)
###### Install the latest version of MongoDB from [here] (https://www.mongodb.org/downloads#production)
###### Install all dependencies

    $ npm install --silent

###### Install security dependency manually (Microsoft Windows only)

    $ npm install bcryptjs

###### Create a file `.env` in the main project directory, and add the process environment variables to it. For instance:

      KEY=value
      DAY=value
      OUT=value
      LIVE=value
      MATCH=value
      BAT_AVG=value
      BAT_STR=value
      BOWL_AVG=value
      BOWL_STR=value
      BOWL_ECO=value
      SENTRY_DSN=value
      GOOGLE_ID=value
      GOOGLE_KEY=value
      TWITTER_ID=value
      TWITTER_KEY=value
      FACEBOOK_ID=value
      FACEBOOK_KEY=value
      MONGO=mongodb://127.0.0.1:27017/GPL
      SENTRY_DSN=value_

###### Start the localhost mongod server via `mongod`

###### Seed the local database by running:

    npm run seed

###### Run the server locally at port 3000 or "PORT" in process.env

    $ npm start

###### View the website at localhost:3000 within your browser

#### External Requirements:

* A MongoDB instance running locally or valid "MONGOLAB_URI"/"MONGOHQ_URI" string in process.env
* A valid collection of social authentication tokens in process.env (Facebook, Twitter, and Google)
* A valid "COOKIE_SECRET" string in process.env for better security (Optional)
* A valid "LOGENTRIES_TOKEN" in process.env for Logentries support (Optional)
* A valid "NEWRELIC_APP_NAME" and "NEWRELIC_LICENSE" in process.env for New Relic support (Optional)
* A valid "SENTRY_DSN" token in process.env for Sentry error alerts (optional)

*PS:* Configure a file watcher with the public directory scope to incorporate auto-minification of public .css and .js files.
