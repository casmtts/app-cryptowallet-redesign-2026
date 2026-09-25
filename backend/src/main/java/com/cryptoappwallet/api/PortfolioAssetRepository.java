package com.cryptoappwallet.api.repository;

import com.cryptoappwallet.api.domain.PortfolioAsset;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioAssetRepository extends JpaRepository<PortfolioAsset, Long> {
    List<PortfolioAsset> findAllByOrderByIdAsc();
}
