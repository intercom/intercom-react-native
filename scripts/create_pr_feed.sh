#!/bin/bash
HASH=$(echo -n $CIRCLE_PULL_REQUEST | openssl dgst -sha256 -hmac $SECRET)
curl -d "team_id=$TEAM_ID&url=$URL&secret=$HASH" -X POST https://prfeed.internal.intercom.io/extension/create