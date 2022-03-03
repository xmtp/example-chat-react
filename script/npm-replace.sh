#!/usr/bin/env bash

# This is an awful hack, but we only need it for a few weeks until we make the npm package public
# Required for GH Actions and CloudFlare Pages

set -e

if [[ -z "$XMTP_GH_TOKEN" ]]; then
  echo "Not replacing package.json"
  exit 0
else
  echo "Replacing repo in package.json"
  sed -i '' "s/github:xmtp\/xmtp-js/git+https:\/\/$XMTP_GH_TOKEN:x-oauth-basic@github.com\/xmtp\/xmtp-js.git/g" package.json
fi
