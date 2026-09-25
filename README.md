# CryptoApp Wallet — Redesign 2026

Carteira mobile de criptoativos com tema claro, interface em português e foco em leitura rápida do portfólio. O projeto combina aplicativo Expo/React Native, API Java Spring Boot e persistência PostgreSQL.

## Telas do projeto

Capturas das telas de referência criadas no Google Stitch para este projeto.

| Portfólio | Login claro |
| --- | --- |
| ![Portfólio CryptoApp Wallet](https://lh3.googleusercontent.com/aida/AEtjO1XFKd1d9fxRuwxKtif51ZcOfDRcOUyi9AXg9rABk27Af6e32Nodu8UYiMwyvSXTlF32Dy_FbEirVYCPIbMZ_nsay3manmdBE4wIf1NCu4WW-SP1P5mjDQT4ZR7hZPAEYYu4Rgoi4FKemJPPCwrSYrY8-7V3piLPCKd5Rwqhd4af-84mgdO2KZppYB5NNw7X2CyyP_6SatJiCsKIeEPip8vIP9Q_pzkcUq8EaJCOA7LPcOL2Sun5DHcKF58) | ![Login claro](https://lh3.googleusercontent.com/aida/AEtjO1Wo3KMjWH60xqkm7JLcdcvnHzpo6jZ6ltDxdVDupTkU-pIIwfCa3FpMMXNBqbvoThsPb31L72r_a2QdLbxnElDj5p2cbq4zYMiSifftxghUgZHwoMojG1qY8V0Eho76tjmG75QCTUxcSdC4ezqa1Q-cUo4nL9MfA1YNYd5YYOFSC20BVrnfLIvXUqYwuYgDKFfWPc_V6SUnCKcA4LOsiNEqvBHl-qSaNZh2887cIRU0y8Uj3xpI9srFeQ) |

| Depósito e recebimento | Troca de ativos |
| --- | --- |
| ![Depósito e recebimento](https://lh3.googleusercontent.com/aida/AEtjO1XK6WChploI_ld4_Z6GUWv7NhQgedwXGU4wm8OrySsAS2GqvNre8xFq65Ru5M8QeL2-wmp4lnF_n86Is_-nlaVKoL9t2BvKLR4TvBcvWSZ6VDnoR9qJ1gUvD_2N9Td0BgGHN6bidB3Ivv2PQFtGYqbWNNwkfLWLYmZZfnnvRP7EjjiUqH0etbZiOZn2GlmNiQ7Ldv6cRpoSeT1pVqmn3T0v99eOkzbfdgjng3l3E1hvxLZScv968Uj_TWc) | ![Troca de ativos](https://lh3.googleusercontent.com/aida/AEtjO1UytjkgRQ2L0dtYRL4ruf_Acrxt9DbhB8g22dn7wc1cTn5rdY5xEfzNz-66SUt8_q-ny_SA3dl8mrVtab4N1bOTbrsU7cAoWxZ7AJvx3SkMOB67RSc3ndiMdoXbFLgOZ2izszBVKv5eyEVaqDEjleMmRQ5raBN4sj-9-oLfHflSSujPajVSjeQhyjXezYwGtRfZCrm2UaOuRFvSfibyki6wrXW3M04psOFRDTWvYg4s9yct67QIl_UjM1I) |

## Características

- Login e cadastro com validação local.
- Portfólio com saldo, gráfico, variação, alocação e ativos BTC, ETH, USDT e BNB.
- Seletor de rede Bitcoin Mainnet e Ethereum Mainnet.
- Mockup de depósito com rede selecionável, endereço e QR ilustrativos.
- Mockup de envio com seleção de ativo, destino, valor, taxas e revisão.
- Mockup de troca com estimativa, cotação, taxa e slippage.
- Análises com gráfico por período, indicadores e distribuição dos ativos.
- API Spring Boot com dados de demonstração persistidos no PostgreSQL.

## Tecnologias

| Camada | Stack |
| --- | --- |
| Aplicativo | Expo, React Native, TypeScript |
| UI e estilos | React Native Paper, NativeWind 4, Tailwind CSS 3 |
| API | Java 21, Spring Boot, Spring Data JPA |
| Banco de dados | PostgreSQL 17 |

## Rodar localmente

Pré-requisitos: Node.js 22.13+, Docker Compose e, para executar a API fora do Docker, Java 21 e Maven 3.9+.

    cp .env.example .env
    docker compose up -d --build
    npm install
    npm run start

Para abrir em um telefone físico, configure EXPO_PUBLIC_API_URL no .env com o IP local da máquina, por exemplo http://192.168.1.25:8080. Localhost funciona no simulador iOS e no app web executado no mesmo computador.

Para executar a API fora do Docker, acesse backend/ e rode mvn spring-boot:run. O perfil local usa os valores padrão de .env.example.

## API

- GET /api/v1/portfolio — saldo agregado, variação de 30 dias e ativos.

## Observações

Depósito, envio e troca são protótipos visuais. Endereços, QR Codes, taxas e cotações são ilustrativos; nenhuma transação é assinada ou transmitida. A autenticação ainda não possui API de contas nem armazenamento seguro de credenciais.
