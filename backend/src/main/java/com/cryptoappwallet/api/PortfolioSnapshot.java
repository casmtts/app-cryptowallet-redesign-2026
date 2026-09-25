package com.cryptoappwallet.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "portfolio_snapshots")
public class PortfolioSnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "captured_at", nullable = false, unique = true)
    private Instant capturedAt;

    @Column(name = "total_value_usd", nullable = false, precision = 20, scale = 2)
    private BigDecimal totalValueUsd;

    protected PortfolioSnapshot() {}

    public PortfolioSnapshot(Instant capturedAt, BigDecimal totalValueUsd) {
        this.capturedAt = capturedAt;
        this.totalValueUsd = totalValueUsd;
    }

    public Instant getCapturedAt() { return capturedAt; }
    public BigDecimal getTotalValueUsd() { return totalValueUsd; }
}
