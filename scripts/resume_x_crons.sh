#!/usr/bin/env bash
# Script para reanudar los crons de X que fueron pausados
echo "Reanudando crons de X (Twitter)..."
launchctl load ~/Library/LaunchAgents/com.ranukita-x-reply.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/com.ranuk.x-seguir.plist 2>/dev/null || true
echo "✓ Crons de X reanudados correctamente."
