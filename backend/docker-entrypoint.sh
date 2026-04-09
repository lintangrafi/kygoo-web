#!/bin/sh
set -eu

APP_ENV="${APP_ENV:-staging}"
TEMPLATE_PATH="/app/config/config.template.yaml"
TARGET_PATH="/app/config/config.${APP_ENV}.yaml"

if [ ! -f "$TEMPLATE_PATH" ]; then
  echo "ERROR: config template not found at $TEMPLATE_PATH"
  exit 1
fi

envsubst < "$TEMPLATE_PATH" > "$TARGET_PATH"

echo "Starting backend with env: $APP_ENV"
exec /app/main --env="$APP_ENV"
