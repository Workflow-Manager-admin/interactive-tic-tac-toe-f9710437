#!/bin/bash
cd /home/kavia/workspace/code-generation/clone---tic-tac-toe-interactive-tic-tac-toe-f9710437-39624/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

