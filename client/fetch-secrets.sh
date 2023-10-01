#!/bin/bash
aws ssm get-parameters-by-path \
    --path "/path/to/your/secrets" \
    --recursive \
    --with-decryption \
    --query "Parameters[*].[Name,Value]" \
    --output text \
    | awk '{print $1 "=" $2}' > .env
