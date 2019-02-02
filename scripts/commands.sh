#!/bin/bash

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. >/dev/null 2>&1 && pwd )"

# Compile contracts
compile() {
  ./node_modules/.bin/truffle compile --all
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

compile_sample_project() {
  go_to_sample_project
  ../node_modules/.bin/truffle compile
  [ $? -ne 0 ] && exit 1
}

migrate_sample_project() {
  go_to_sample_project
  ../node_modules/.bin/truffle migrate --network test
  [ $? -ne 0 ] && exit 1
}

modularize_sample_project() {
  go_to_sample_project
  npm install
  ../node_modules/.bin/truffle run modularize
  [ $? -ne 0 ] && exit 1
}

# Run test cases with truffle
run_test_cases() {
  go_to_project_root
  ./node_modules/.bin/mocha
  [ $? -ne 0 ] && exit 1
}

