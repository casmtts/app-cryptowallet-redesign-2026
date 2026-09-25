package com.cryptoappwallet.api.service;

import com.cryptoappwallet.api.domain.PortfolioAsset;
import com.cryptoappwallet.api.dto.AssetResponse;
import com.cryptoappwallet.api.dto.PortfolioResponse;
import com.cryptoappwallet.api.repository.PortfolioAssetRepository;
import com.cryptoappwallet.api.repository.PortfolioSnapshotRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PortfolioService {
    private static final BigDecimal ZERO = new BigDecimal("0.00");

    private final PortfolioAssetRepository assets;
    private final PortfolioSnapshotRepository snapshots;

    public PortfolioService(PortfolioAssetRepository assets, PortfolioSnapshotRepository snapshots) {
        this.assets = assets;
        this.snapshots = snapshots;
    }

    @Transactional(readOnly = true)
    public PortfolioResponse getPortfolio() {
        List<PortfolioAsset> storedAssets = assets.findAllByOrderByIdAsc();
        List<AssetResponse> assetResponses = storedAssets.stream()
                .map(asset -> new AssetResponse(
                        asset.getId(), asset.getSymbol(), asset.getName(), asset.getQuantity(),
                        asset.getPriceUsd(), asset.getValueUsd(), asset.getChangePercent24h(),
                        asset.getColor(), asset.getIcon()))
                .toList();

        BigDecimal currentValue = assetResponses.stream()
                .map(AssetResponse::valueUsd)
                .reduce(ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
        Instant cutoff = Instant.now().minus(30, ChronoUnit.DAYS);
        BigDecimal priorValue = snapshots.findFirstByCapturedAtLessThanEqualOrderByCapturedAtDesc(cutoff)
                .map(snapshot -> snapshot.getTotalValueUsd())
                .orElse(currentValue);
        BigDecimal delta = currentValue.subtract(priorValue).setScale(2, RoundingMode.HALF_UP);
        BigDecimal percent = priorValue.signum() == 0
                ? ZERO
                : delta.multiply(new BigDecimal("100"))
                        .divide(priorValue, 1, RoundingMode.HALF_UP);

        return new PortfolioResponse("USD", currentValue, delta, percent, "30D", assetResponses);
    }
}
