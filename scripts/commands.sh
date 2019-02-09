#!/bin/bash

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. >/dev/null 2>&1 && pwd )"

# Compile contracts
compile() {
  ./node_modules/.bin/truffle compile --all --quiet
  [ $? -ne 0 ] && exit 1
}

go_to_sample_project() {
   go_to_project_root
   cd sample-truffle
}

go_to_project_root() {
   cd $PROJECT_ROOT
}

# Run private block-chain for test cases
run_sample_net() {
  go_to_project_root
  ./node_modules/.bin/ganache-cli -p 8777 -i 1243 > /dev/null & pid=$!
  if ps -p $pid > /dev/null
  then
    echo "Running ganache..."
  else
    echo "Failed to run a chain"
    exit 1
  fi
}

# Terminate running ganache
kill_sample_net() {
  echo "Terminate ganache"
  if !([ -z ${pid+x} ]);then
    kill $pid > /dev/null 2>&1
  fi
}

clear_sample_project() {
  go_to_sample_project
  rm -rf build
  [ $? -ne 0 ] && exit 1
}

compile_sample_project() {
  go_to_sample_project
  ../node_modules/.bin/truffle compile --all --quiet
  [ $? -ne 0 ] && exit 1
}

migrate_sample_project() {
  go_to_sample_project
  ../node_modules/.bin/truffle migrate --network test --quiet
  [ $? -ne 0 ] && exit 1
}

install_plugin() {
  go_to_sample_project
  npm install ../ --quiet
  [ $? -ne 0 ] && exit 1
}

modularize_sample_project() {
  go_to_sample_project
  ../node_modules/.bin/truffle run modularize "$@"
  [ $? -ne 0 ] && exit 1
}

apply_truffle_config() {
  go_to_sample_project
  cp $1 truffle-config.js
}

# Run test cases with truffle
run_test_case() {
  go_to_project_root
  ./node_modules/.bin/mocha "$@"
  [ $? -ne 0 ] && exit 1
}

test_default() {
    echo "[Test] Test with default option"
    apply_truffle_config truffle-config-test-default.js
    clear_sample_project
    compile_sample_project
    migrate_sample_project
    modularize_sample_project
    run_test_case test/modularizer.default.js
}

test_settings_with_truffle_config() {
    echo "[Test] Test with configuration in truffle-config.js"
    apply_truffle_config truffle-config-test-config.js
    clear_sample_project
    compile_sample_project
    migrate_sample_project
    modularize_sample_project
    run_test_case test/modularizer.config.js
}

test_settings_with_cli_options() {
    echo "[Test] Test with cli options"
    apply_truffle_config truffle-config-test-cli.js
    clear_sample_project
    compile_sample_project
    migrate_sample_project
    modularize_sample_project --output src/custom/index.js --target build/contracts SampleContract --network test
    run_test_case test/modularizer.cli.js
}

recover_truffle_config() {
  go_to_sample_project
  cp truffle-config-bak.js truffle-config.js
}