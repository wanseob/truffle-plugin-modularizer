#!/bin/bash

source $(dirname "$0")/commands.sh
trap kill_sample_net SIGINT SIGTERM SIGTSTP EXIT
trap recover_truffle_config SIGINT SIGTERM SIGTSTP EXIT
run_sample_net
install_plugin
test_settings_with_truffle_config
test_settings_with_cli_options
test_default
exit 0
