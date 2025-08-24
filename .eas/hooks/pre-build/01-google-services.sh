#!/bin/bash

# Create config directory if it doesn't exist
mkdir -p ./config

# Decode and write the google-services.json file
echo $GOOGLE_SERVICES_JSON | base64 -d > ./config/google-service-account.json 