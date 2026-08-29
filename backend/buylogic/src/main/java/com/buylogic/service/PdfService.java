package com.buylogic.service;

import com.buylogic.model.Company;
import com.buylogic.model.PurchaseOrder;
import com.buylogic.model.PurchaseOrderItem;
import com.buylogic.model.Supplier;
import com.buylogic.model.SupplierProduct;
import com.buylogic.repository.global.SupplierProductRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfService {

    private final SupplierProductRepository supplierProductRepository;

    public PdfService(SupplierProductRepository supplierProductRepository) {
        this.supplierProductRepository = supplierProductRepository;
    }

    public byte[] generatePurchaseOrderPdf(Company company, Supplier supplier, PurchaseOrder order, List<PurchaseOrderItem> items) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            // 1. En-tête : Émetteur (gauche) & Infos Commande / Fournisseur (droite)
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{1f, 1f});

            // Cellule Entreprise (Gauche)
            PdfPCell companyCell = new PdfPCell();
            companyCell.setBorder(Rectangle.NO_BORDER);
            companyCell.addElement(new Paragraph(company != null ? company.getName() : "BuyLogic", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            companyCell.addElement(new Paragraph(company != null && company.getAddress() != null ? company.getAddress() : "", FontFactory.getFont(FontFactory.HELVETICA, 9)));
            if (company != null && company.getSiret() != null) {
                companyCell.addElement(new Paragraph("SIRET : " + company.getSiret(), FontFactory.getFont(FontFactory.HELVETICA, 9)));
            }
            headerTable.addCell(companyCell);

            // Cellule Commande & Fournisseur (Droite)
            PdfPCell orderCell = new PdfPCell();
            orderCell.setBorder(Rectangle.NO_BORDER);
            orderCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            
            Paragraph title = new Paragraph("BON DE COMMANDE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12));
            title.setAlignment(Element.ALIGN_RIGHT);
            orderCell.addElement(title);

            Paragraph ref = new Paragraph("Réf : " + order.getOrderNumber(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10));
            ref.setAlignment(Element.ALIGN_RIGHT);
            orderCell.addElement(ref);
            
            String orderDateStr;
            if (order.getOrderedAt() != null) {
                orderDateStr = order.getOrderedAt().format(dateFormatter);
            } else {
                orderDateStr = java.time.LocalDate.now().format(dateFormatter);
            }
            
            Paragraph date = new Paragraph("Date : " + orderDateStr, FontFactory.getFont(FontFactory.HELVETICA, 9));
            date.setAlignment(Element.ALIGN_RIGHT);
            orderCell.addElement(date);
            headerTable.addCell(orderCell);
            document.add(headerTable);

            document.add(new Paragraph("\n"));

            // 2. Bloc Fournisseur Destinataire
            PdfPTable supplierTable = new PdfPTable(1);
            supplierTable.setWidthPercentage(100);
            PdfPCell supplierCell = new PdfPCell();
            supplierCell.setPadding(10);
            supplierCell.setBackgroundColor(new java.awt.Color(245, 247, 250));
            supplierCell.setBorderColor(new java.awt.Color(200, 200, 200));
            
            Supplier targetSupplier = supplier != null ? supplier : order.getSupplier();
            supplierCell.addElement(new Paragraph("DESTINATAIRE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8)));
            supplierCell.addElement(new Paragraph(targetSupplier != null ? targetSupplier.getName() : "", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
            if (targetSupplier != null && targetSupplier.getAddress() != null) {
                supplierCell.addElement(new Paragraph(targetSupplier.getAddress(), FontFactory.getFont(FontFactory.HELVETICA, 9)));
            }
            supplierTable.addCell(supplierCell);
            
            document.add(supplierTable);
            document.add(new Paragraph("\n"));

            // 3. Tableau des articles (5 colonnes)
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1.5f, 2.5f, 1f, 1f, 1f});

            // En-têtes du tableau
            addTableHeader(table, "Réf. Fournisseur");
            addTableHeader(table, "Article");
            addTableHeader(table, "Quantité");
            addTableHeader(table, "P.U. HT");
            addTableHeader(table, "Total HT");

            BigDecimal grandTotal = BigDecimal.ZERO;
            Integer supplierId = targetSupplier != null ? targetSupplier.getIdSupplier() : null;

            // Lignes d'articles
            for (PurchaseOrderItem item : items) {
                String supplierReference = "-";
                if (supplierId != null && item.getProduct() != null) {
                    SupplierProduct sp = supplierProductRepository.findByProductIdProductAndSupplierIdSupplier(
                        item.getProduct().getIdProduct(), supplierId
                    ).orElse(null);
                    if (sp != null && sp.getSupplierReference() != null && !sp.getSupplierReference().isBlank()) {
                        supplierReference = sp.getSupplierReference();
                    }
                }

                table.addCell(new PdfPCell(new Paragraph(supplierReference, FontFactory.getFont(FontFactory.HELVETICA, 8))));
                table.addCell(new PdfPCell(new Paragraph(item.getProduct().getName(), FontFactory.getFont(FontFactory.HELVETICA, 9))));
                
                BigDecimal qty = item.getQuantityOrdered() != null ? item.getQuantityOrdered().stripTrailingZeros() : BigDecimal.ZERO;
                table.addCell(new PdfPCell(new Paragraph(qty.toPlainString(), FontFactory.getFont(FontFactory.HELVETICA, 9))));
                
                BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice().setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
                table.addCell(new PdfPCell(new Paragraph(unitPrice + " €", FontFactory.getFont(FontFactory.HELVETICA, 9))));
                
                BigDecimal lineTotal = unitPrice.multiply(qty).setScale(2, RoundingMode.HALF_UP);
                table.addCell(new PdfPCell(new Paragraph(lineTotal + " €", FontFactory.getFont(FontFactory.HELVETICA, 9))));

                grandTotal = grandTotal.add(lineTotal);
            }

            // 4. Lignes des Totaux (HT, TVA, TTC)
            BigDecimal tvaRate = new BigDecimal("0.20"); // 20%
            BigDecimal totalTva = grandTotal.multiply(tvaRate).setScale(2, RoundingMode.HALF_UP);
            BigDecimal totalTtc = grandTotal.add(totalTva).setScale(2, RoundingMode.HALF_UP);

            // Ligne Total HT
            PdfPCell totalHtLabel = new PdfPCell(new Paragraph("TOTAL HT", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9)));
            totalHtLabel.setColspan(4);
            totalHtLabel.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalHtLabel.setPadding(5);
            totalHtLabel.setBackgroundColor(new java.awt.Color(245, 247, 250));
            table.addCell(totalHtLabel);

            PdfPCell totalHtVal = new PdfPCell(new Paragraph(grandTotal.setScale(2, RoundingMode.HALF_UP) + " €", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9)));
            totalHtVal.setPadding(5);
            totalHtVal.setBackgroundColor(new java.awt.Color(245, 247, 250));
            table.addCell(totalHtVal);

            // Ligne TVA
            PdfPCell tvaLabel = new PdfPCell(new Paragraph("TVA (20%)", FontFactory.getFont(FontFactory.HELVETICA, 9)));
            tvaLabel.setColspan(4);
            tvaLabel.setHorizontalAlignment(Element.ALIGN_RIGHT);
            tvaLabel.setPadding(5);
            tvaLabel.setBackgroundColor(new java.awt.Color(245, 247, 250));
            table.addCell(tvaLabel);

            PdfPCell tvaVal = new PdfPCell(new Paragraph(totalTva + " €", FontFactory.getFont(FontFactory.HELVETICA, 9)));
            tvaVal.setPadding(5);
            tvaVal.setBackgroundColor(new java.awt.Color(245, 247, 250));
            table.addCell(tvaVal);

            // Ligne Total TTC
            PdfPCell totalTtcLabel = new PdfPCell(new Paragraph("TOTAL TTC", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
            totalTtcLabel.setColspan(4);
            totalTtcLabel.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalTtcLabel.setPadding(6);
            totalTtcLabel.setBackgroundColor(new java.awt.Color(230, 235, 245));
            table.addCell(totalTtcLabel);

            PdfPCell totalTtcVal = new PdfPCell(new Paragraph(totalTtc + " €", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
            totalTtcVal.setPadding(6);
            totalTtcVal.setBackgroundColor(new java.awt.Color(230, 235, 245));
            table.addCell(totalTtcVal);

            // Ajout unique du tableau complet au document
            document.add(table);

            // 5. Horaires de réception en bas (si renseignés)
            if (company != null && company.getReceptionHours() != null && !company.getReceptionHours().isBlank()) {
                document.add(new Paragraph("\n"));
                PdfPTable receptionTable = new PdfPTable(1);
                receptionTable.setWidthPercentage(100);
                PdfPCell receptionCell = new PdfPCell();
                receptionCell.setPadding(8);
                receptionCell.setBackgroundColor(new java.awt.Color(245, 247, 250));
                receptionCell.setBorderColor(new java.awt.Color(200, 200, 200));
                
                receptionCell.addElement(new Paragraph("HORAIRES DE RÉCEPTION", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8)));
                receptionCell.addElement(new Paragraph(company.getReceptionHours(), FontFactory.getFont(FontFactory.HELVETICA, 9)));
                receptionTable.addCell(receptionCell);
                
                document.add(receptionTable);
            }

            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Erreur génération PDF BuyLogic", e);
        }

        return out.toByteArray();
    }

    private void addTableHeader(PdfPTable table, String title) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(new java.awt.Color(15, 23, 42));
        header.setPadding(6);
        Paragraph p = new Paragraph(title, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, java.awt.Color.WHITE));
        header.addElement(p);
        table.addCell(header);
    }
}