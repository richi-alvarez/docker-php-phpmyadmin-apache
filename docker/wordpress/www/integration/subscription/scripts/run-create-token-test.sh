#!/usr/bin/env bash
set -euo pipefail

for arg in "$@"; do
  case "$arg" in
    EPAYCO_API_KEY=*|EPAYCO_PRIVATE_KEY=*|API_KEY=*|PRIVATE_KEY=*)
      export "$arg"
      ;;
  esac
done

export RUN_INTEGRATION=1

exec phpunit -c phpunit.integration.xml --filter test_create_token_with_real_endpoint
