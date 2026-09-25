package com.cryptoappwallet.api.dto;

import java.math.BigDecimal;
import java.util.List;

public record PortfolioResponse(
        String currency,
        BigDecimal totalBalanceUsd,
        BigDecimal periodChangeUsd,
        BigDecimal periodChangePercent,
        String period,
        List<AssetResponse> assets) {}
