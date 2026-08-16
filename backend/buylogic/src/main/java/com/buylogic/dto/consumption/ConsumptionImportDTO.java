package com.buylogic.dto.consumption;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsumptionImportDTO {

    private String fileName;
    private String fileHash;
    private List<ConsumptionImportRowDTO> rows;
}