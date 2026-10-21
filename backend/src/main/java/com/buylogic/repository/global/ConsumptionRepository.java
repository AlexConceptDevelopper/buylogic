package com.buylogic.repository.global;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.buylogic.model.Consumption;
import com.buylogic.repository.GenericRepository;

public interface ConsumptionRepository
        extends GenericRepository<Consumption, Integer> {

    List<Consumption> findAllByProduct_Company_IdCompany(
        Integer companyId
    );

    Optional<Consumption>
    findByIdConsumptionAndProduct_Company_IdCompany(
        Integer idConsumption,
        Integer companyId
    );

    List<Consumption>
    findByProductIdProductAndProduct_Company_IdCompanyAndConsumptionDateBetween(
        Integer idProduct,
        Integer companyId,
        LocalDate startDate,
        LocalDate endDate
    );
}