package com.cryptoappwallet.api.repository;

import com.cryptoappwallet.api.domain.PortfolioSnapshot;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioSnapshotRepository extends JpaRepository<PortfolioSnapshot, Long> {
    Optional<PortfolioSnapshot> findFirstByCapturedAtLessThanEqualOrderByCapturedAtDesc(Instant capturedAt);
}
