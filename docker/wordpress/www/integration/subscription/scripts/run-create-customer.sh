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

phpunit -c phpunit.integration.xml --filter test_registers_customer
