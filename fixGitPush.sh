#!/bin/bash

## This only matters when other projects have set very large buffer sizes and you get the obtuse error about "fatal: protocol error: bad line length "

git config http.postBuffer 1M
git config http.maxRequestBuffer 1M
