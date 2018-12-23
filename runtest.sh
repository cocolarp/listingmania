#!/bin/bash

TZ=utc npx jest --config=node_modules/systematic/default_config/jest.conf.js $@
