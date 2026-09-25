package com.cryptoappwallet.api.web;

import com.cryptoappwallet.api.dto.PortfolioResponse;
import com.cryptoappwallet.api.service.PortfolioService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/portfolio")
@CrossOrigin(origins = "*")
public class PortfolioController {
    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping
    public PortfolioResponse getPortfolio() {
        return portfolioService.getPortfolio();
    }
}
