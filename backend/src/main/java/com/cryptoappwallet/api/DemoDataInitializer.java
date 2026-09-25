package com.cryptoappwallet.api.config;

import com.cryptoappwallet.api.domain.PortfolioAsset;
import com.cryptoappwallet.api.domain.PortfolioSnapshot;
import com.cryptoappwallet.api.repository.PortfolioAssetRepository;
import com.cryptoappwallet.api.repository.PortfolioSnapshotRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DemoDataInitializer {
    @Bean
    ApplicationRunner initializeDemoPortfolio(
            PortfolioAssetRepository assets,
            PortfolioSnapshotRepository snapshots) {
        return args -> {
            if (assets.count() == 0) {
                assets.saveAll(List.of(
                        new PortfolioAsset("BTC", "Bitcoin", decimal("0.10"), decimal("91227.20"), decimal("1.82"), "#F4B942", "bitcoin"),
                        new PortfolioAsset("ETH", "Ethereum", decimal("1.00"), decimal("4354.20"), decimal("2.16"), "#8C7BFF", "ethereum"),
                        new PortfolioAsset("USDT", "Tether USD", decimal("1050.00"), decimal("1.00"), decimal("0.01"), "#37C89A", "currency-usd"),
                        new PortfolioAsset("BNB", "BNB", decimal("1.00"), decimal("540.26"), decimal("-1.42"), "#EABF48", "alpha-b-circle")));
            }

            if (snapshots.count() == 0) {
                Instant now = Instant.now().truncatedTo(ChronoUnit.SECONDS);
                snapshots.saveAll(List.of(
                        new PortfolioSnapshot(now.minus(30, ChronoUnit.DAYS), decimal("14518.80")),
                        new PortfolioSnapshot(now, decimal("15067.18"))));
            }
        };
    }

    private static BigDecimal decimal(String value) {
        return new BigDecimal(value);
    }
}
