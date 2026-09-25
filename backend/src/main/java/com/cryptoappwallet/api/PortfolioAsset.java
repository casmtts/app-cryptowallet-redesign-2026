package com.cryptoappwallet.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "portfolio_assets")
public class PortfolioAsset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 12)
    private String symbol;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, precision = 24, scale = 8)
    private BigDecimal quantity;

    @Column(name = "price_usd", nullable = false, precision = 20, scale = 8)
    private BigDecimal priceUsd;

    @Column(name = "change_24h_percent", nullable = false, precision = 8, scale = 4)
    private BigDecimal changePercent24h;

    @Column(name = "accent_color", nullable = false, length = 7)
    private String color;

    @Column(nullable = false, length = 40)
    private String icon;

    protected PortfolioAsset() {}

    public PortfolioAsset(String symbol, String name, BigDecimal quantity, BigDecimal priceUsd,
            BigDecimal changePercent24h, String color, String icon) {
        this.symbol = symbol;
        this.name = name;
        this.quantity = quantity;
        this.priceUsd = priceUsd;
        this.changePercent24h = changePercent24h;
        this.color = color;
        this.icon = icon;
    }

    public Long getId() { return id; }
    public String getSymbol() { return symbol; }
    public String getName() { return name; }
    public BigDecimal getQuantity() { return quantity; }
    public BigDecimal getPriceUsd() { return priceUsd; }
    public BigDecimal getChangePercent24h() { return changePercent24h; }
    public String getColor() { return color; }
    public String getIcon() { return icon; }

    public BigDecimal getValueUsd() {
        return quantity.multiply(priceUsd).setScale(2, java.math.RoundingMode.HALF_UP);
    }
}
