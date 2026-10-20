package com.buylogic.dto.consumption;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ConsumptionImportDTO {

    public ConsumptionImportDTO(String fileName, String fileHash, List<ConsumptionImportRowDTO> rows) {
        this.fileName = fileName;
        this.fileHash = fileHash;
        this.rows = rows;
    }

    private String fileName;
    private String fileHash;
    private List<ConsumptionImportRowDTO> rows;
}