#!/bin/bash

source $(dirname "$0")/commands.sh
trap kill_sample_net SIGINT SIGTERM SIGTSTP EXIT
run_sample_net
compile_sample_project
modularize_sample_project
migrate_sample_project
run_test_cases
exit 0
