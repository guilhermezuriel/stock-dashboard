# 🔑 Configuração de Variáveis de Ambiente

Este projeto usa variáveis de ambiente para configurar chaves de API e outras configurações sensíveis.

## 📁 Arquivo .env

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```bash
# API Keys (OBRIGATÓRIO)
VITE_FINNHUB_API_KEY=sua_chave_finnhub_aqui

# API Keys Opcionais
VITE_ALPHA_VANTAGE_API_KEY=sua_chave_alpha_vantage_aqui
VITE_YAHOO_FINANCE_API_KEY=sua_chave_yahoo_finance_aqui

# URLs WebSocket
VITE_FINNHUB_WS_URL=wss://ws.finnhub.io?token=
VITE_ALPHA_VANTAGE_WS_URL=wss://sua_url_websocket_aqui

# Configurações da API
VITE_API_TIMEOUT=10000
VITE_MAX_RETRIES=3

# Configurações do Dashboard
VITE_DEFAULT_SYMBOLS=AAPL,MSFT,GOOGL,BINANCE:BTCUSDT
VITE_CHART_UPDATE_INTERVAL=5000
VITE_MAX_DATA_POINTS=1000
```

## 🔐 Como Obter as Chaves de API

### Finnhub (OBRIGATÓRIO)
1. Acesse [finnhub.io](https://finnhub.io/)
2. Crie uma conta gratuita
3. Vá para "API Keys" no dashboard
4. Copie sua chave de API

### Alpha Vantage (OPCIONAL)
1. Acesse [alphavantage.co](https://alphavantage.co/)
2. Registre-se gratuitamente
3. Obtenha sua chave de API

### Yahoo Finance (OPCIONAL)
1. Acesse [finance.yahoo.com](https://finance.yahoo.com/)
2. Crie uma conta
3. Obtenha credenciais de API

## ⚠️ Importante

- **NUNCA** commite o arquivo `.env` no Git
- O arquivo `.env` já está no `.gitignore`
- Use `.env.example` como template
- Todas as variáveis devem começar com `VITE_` para serem acessíveis no frontend

## 🚀 Como Usar

### 1. Crie o arquivo .env
```bash
cp .env.example .env
```

### 2. Edite o arquivo .env
```bash
nano .env
# ou
code .env
```

### 3. Adicione suas chaves
```bash
VITE_FINNHUB_API_KEY=abc123def456ghi789
```

### 4. Reinicie o servidor de desenvolvimento
```bash
npm run dev
```

## 🔧 Configurações Disponíveis

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `VITE_FINNHUB_API_KEY` | - | **OBRIGATÓRIO** - Chave da API Finnhub |
| `VITE_DEFAULT_SYMBOLS` | AAPL,MSFT,GOOGL | Símbolos padrão para monitorar |
| `VITE_CHART_UPDATE_INTERVAL` | 5000 | Intervalo de atualização dos gráficos (ms) |
| `VITE_MAX_DATA_POINTS` | 1000 | Máximo de pontos de dados nos gráficos |
| `VITE_API_TIMEOUT` | 10000 | Timeout das requisições da API (ms) |
| `VITE_MAX_RETRIES` | 3 | Máximo de tentativas de reconexão |

## 🛡️ Segurança

- As variáveis de ambiente são expostas no frontend (necessário para Vite)
- **NUNCA** coloque chaves secretas que devem ficar apenas no backend
- Use HTTPS em produção
- Considere usar um proxy backend para APIs sensíveis

## 🔍 Verificação

O sistema verifica automaticamente se as variáveis estão configuradas:

- ✅ Console mostrará mensagens de sucesso
- ⚠️ Console mostrará avisos para variáveis faltando
- 🚫 Funcionalidades podem não funcionar sem as chaves obrigatórias

## 🆘 Troubleshooting

### "API key não configurada"
- Verifique se o arquivo `.env` existe
- Confirme se `VITE_FINNHUB_API_KEY` está definido
- Reinicie o servidor após criar/modificar o `.env`

### "Variáveis de ambiente obrigatórias não encontradas"
- Verifique o console do navegador
- Confirme se todas as variáveis obrigatórias estão no `.env`
- Verifique se não há espaços extras nas variáveis

### WebSocket não conecta
- Verifique se a chave da API é válida
- Confirme se a URL do WebSocket está correta
- Teste a chave da API no site da Finnhub

## 📚 Recursos Adicionais

- [Documentação Vite - Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Finnhub API Documentation](https://finnhub.io/docs/api)
- [Alpha Vantage API Documentation](https://www.alphavantage.co/documentation/)
