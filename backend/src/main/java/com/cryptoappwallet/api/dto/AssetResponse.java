package com.cryptoappwallet.api.dto;

import java.math.BigDecimal;

public record AssetResponse(
        Long id,
        String symbol,
        String name,
        BigDecimal quantity,
        BigDecimal priceUsd,
        BigDecimal valueUsd,
        BigDecimal changePercent24h,
        String color,
        String icon) {}
