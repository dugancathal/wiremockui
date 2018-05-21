#!/usr/bin/env bash

CURDIR="$(dirname $0)"

java -jar $CURDIR/wiremock.jar --port="${PORT:-9999}" --verbose --global-response-templating $@
