@echo off
title Atualizador - Cardapio Dinamico
color 0A

echo ====================================================
echo   BAIXANDO ATUALIZACOES DO CARDAPIO DINAMICO
echo ====================================================
echo.

:: 1. Executa o git pull para baixar o codigo do GitHub
git pull

:: 2. Verifica se o git pull ocorreu sem erros
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo ====================================================
    echo   [ERRO] Falha ao baixar as atualizacoes.
    echo   Verifique a conexao de internet do computador.
    echo ====================================================
    echo.
    pause
    exit /b
)

echo.
echo ====================================================
echo   Atualizacao concluida! Reiniciando o sistema...
echo ====================================================
timeout /t 3 >nul

:: 3. Inicia o servidor principal em uma nova janela e fecha este atualizador
start "" "iniciar.bat"
exit