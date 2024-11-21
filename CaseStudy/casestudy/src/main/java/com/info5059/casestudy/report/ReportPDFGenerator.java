package com.info5059.casestudy.report;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.Optional;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import com.info5059.casestudy.vendor.Vendor;
import com.info5059.casestudy.vendor.VendorRepository;
import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;
import com.info5059.casestudy.purchaseorder.PurchaseOrder;
import com.info5059.casestudy.purchaseorder.PurchaseOrderLineItem;
import com.info5059.casestudy.purchaseorder.PurchaseOrderRepository;
import com.itextpdf.io.exceptions.IOException;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.VerticalAlignment;

import org.springframework.web.servlet.view.document.AbstractPdfView;

public abstract class ReportPDFGenerator extends AbstractPdfView {

    public static ByteArrayInputStream generateReport(
            String repid,
            VendorRepository vendorRepository,
            ProductRepository productRepository,
            PurchaseOrderRepository poRepository) throws IOException {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {

            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);

            URL imageUrl = ReportPDFGenerator.class.getResource("/static/images/Logo_CaseStudy.jpg");
            Image img = new Image(ImageDataFactory.create(imageUrl))
                    .setHorizontalAlignment(HorizontalAlignment.LEFT)
                    .scaleToFit(125, 125);

            Table headerTable = new Table(2);
            headerTable.setWidth(new UnitValue(UnitValue.PERCENT, 100));

            // Add the image to the first column
            Cell imageCell = new Cell().add(img).setBorder(Border.NO_BORDER);
            headerTable.addCell(imageCell);

            // Add the text to the second column
            Paragraph poIdParagraph = new Paragraph("Purchase Order\nID # " + repid)
                    .setFont(font).setFontSize(12)
                    .setTextAlignment(TextAlignment.RIGHT).setBold();

            Cell textCell = new Cell().add(poIdParagraph)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE)
                    .setBorder(Border.NO_BORDER);
            headerTable.addCell(textCell);

            // Add the table to the document
            document.add(headerTable);

            // Table created, but not added yet
            Table table = new Table(5);
            table.setWidth(new UnitValue(UnitValue.PERCENT, 100));

            // Headers
            Cell cell = new Cell().add(new Paragraph("Product Code")
                    .setFont(font).setFontSize(12).setBold())
                    .setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph("Description")
                    .setFont(font).setFontSize(12).setBold())
                    .setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph("QTY Sold")
                    .setFont(font).setFontSize(12).setBold())
                    .setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph("Price")
                    .setFont(font).setFontSize(12).setBold())
                    .setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);
            cell = new Cell().add(new Paragraph("Ext. Price")
                    .setFont(font).setFontSize(12).setBold())
                    .setTextAlignment(TextAlignment.CENTER);
            table.addCell(cell);

            // Table Data
            Optional<PurchaseOrder> nullablePO = poRepository.findById(Long.parseLong(repid));
            if (nullablePO.isPresent()) {

                PurchaseOrder po = nullablePO.get();

                Optional<Vendor> nullableVendor = vendorRepository
                        .findById(po.getVendorid());
                if (nullableVendor.isPresent()) {

                    // Vendor data
                    Vendor vendor = nullableVendor.get();
                    String vendorInfo = "Vendor: "
                            + vendor.getName()
                            + "\n"
                            + vendor.getAddress1()
                            + "\n"
                            + vendor.getCity()
                            + "\n"
                            + vendor.getProvince()
                            + "\n"
                            + vendor.getEmail();

                    document.add(new Paragraph(vendorInfo)
                            .setFont(font).setFontSize(12)
                            .setTextAlignment(TextAlignment.LEFT).setBold());
                }

                BigDecimal subTotal = BigDecimal.ZERO;
                BigDecimal tax = BigDecimal.ZERO;
                BigDecimal poTotal = BigDecimal.ZERO;
                Locale locale = Locale.US;
                NumberFormat numberFormatter = NumberFormat.getCurrencyInstance(locale);

                for (PurchaseOrderLineItem item : po.getItems()) {
                    Optional<Product> nullableProduct = productRepository
                            .findById(item.getProductid());
                    if (!nullableProduct.isPresent()) {
                        continue;
                    }

                    int productQTY = item.getQty();
                    BigDecimal productPrice = item.getPrice();
                    BigDecimal productExtPrice = productPrice.multiply(BigDecimal.valueOf(productQTY));

                    Product product = nullableProduct.get();
                    subTotal = subTotal.add(productExtPrice,
                            new MathContext(8, RoundingMode.UP));

                    String productCode = "" + item.getProductid();
                    String productQTYSold = "" + productQTY;
                    String productDescription = product.getName();
                    String productPriceAmount = numberFormatter.format(productPrice);
                    String productExtPriceAmount = numberFormatter.format(productExtPrice);

                    // Rows
                    cell = new Cell().add(new Paragraph(productCode)
                            .setFont(font).setFontSize(12)
                            .setTextAlignment(TextAlignment.CENTER));
                    table.addCell(cell);
                    cell = new Cell().add(new Paragraph(productDescription)
                            .setFont(font).setFontSize(12)
                            .setTextAlignment(TextAlignment.CENTER));
                    table.addCell(cell);
                    cell = new Cell().add(new Paragraph(productQTYSold)
                            .setFont(font).setFontSize(12)
                            .setTextAlignment(TextAlignment.CENTER));
                    table.addCell(cell);
                    cell = new Cell().add(new Paragraph(productPriceAmount)
                            .setFont(font).setFontSize(12)
                            .setTextAlignment(TextAlignment.RIGHT));
                    table.addCell(cell);
                    cell = new Cell().add(new Paragraph(productExtPriceAmount)
                            .setFont(font).setFontSize(12)
                            .setTextAlignment(TextAlignment.RIGHT));
                    table.addCell(cell);
                }

                tax = subTotal.multiply(BigDecimal.valueOf(0.13));
                poTotal = subTotal.add(tax);

                String subTotalAmount = numberFormatter.format(subTotal);
                String taxAmount = numberFormatter.format(tax);
                String poTotalAmount = numberFormatter.format(poTotal);

                cell = new Cell(1, 4).add(new Paragraph("Sub Total:")
                        .setFont(font).setFontSize(12)
                        .setTextAlignment(TextAlignment.RIGHT));
                table.addCell(cell);
                cell = new Cell().add(new Paragraph(subTotalAmount)
                        .setFont(font).setFontSize(12)
                        .setTextAlignment(TextAlignment.RIGHT));
                table.addCell(cell);
                cell = new Cell(1, 4).add(new Paragraph("Tax:")
                        .setFont(font).setFontSize(12)
                        .setTextAlignment(TextAlignment.RIGHT));
                table.addCell(cell);
                cell = new Cell().add(new Paragraph(taxAmount)
                        .setFont(font).setFontSize(12)
                        .setTextAlignment(TextAlignment.RIGHT));
                table.addCell(cell);
                cell = new Cell(1, 4).add(new Paragraph("PO Total:")
                        .setFont(font).setFontSize(12).setBold()
                        .setTextAlignment(TextAlignment.RIGHT));
                table.addCell(cell);
                cell = new Cell().add(new Paragraph(poTotalAmount)
                        .setFont(font).setFontSize(12)
                        .setBold().setTextAlignment(TextAlignment.RIGHT)
                        .setBackgroundColor(ColorConstants.YELLOW));
                table.addCell(cell);
            }

            document.add(new Paragraph("\n"));
            document.add(table);
            document.add(new Paragraph("\n"));

            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            document.add(new Paragraph(dateTimeFormatter.format(LocalDateTime.now()))
                    .setTextAlignment(TextAlignment.CENTER));
            document.close();
        } catch (Exception ex) {
            Logger.getLogger(ReportPDFGenerator.class.getName()).log(Level.SEVERE, null, ex);
        }

        return new ByteArrayInputStream(baos.toByteArray());
    }
}
