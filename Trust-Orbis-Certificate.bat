@echo off
title Trust Orbis Open Source Certificate
echo ========================================================
echo   Orbis Media Player - Trust Code Signing Certificate
echo ========================================================
echo.
echo Installing public certificate for publisher Vishal-VN...
certutil -addstore -user TrustedPublisher "%~dp0public\orbis-signer.cer"
echo.
echo [SUCCESS] Vishal-VN has been added to your Trusted Publishers!
echo Windows SmartScreen and UAC will now verify Orbis builds.
echo.
pause
