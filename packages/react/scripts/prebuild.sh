#!/usr/bin/env bash

# Public: Performs pre-build actions such as building dependencies.
#
# Examples
#
#   ./bin/prebuild.sh
#
# Returns exit code 0.
function main {
  # build workspace dependencies
  pnpm -F @kibisis/katavault-core build

  exit 0
}

# and so, it begins...
main "$@"
