package com.info5059.serverexercises.report;

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

import com.info5059.serverexercises.employee.Employee;
import com.info5059.serverexercises.employee.EmployeeRepository;
import com.info5059.serverexercises.expense.Expense;
import com.info5059.serverexercises.expense.ExpenseRepository;

import com.itextpdf.io.exceptions.IOException;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.HorizontalAlignment;

import org.springframework.web.servlet.view.document.AbstractPdfView;

public abstract class ReportPDFGenerator extends AbstractPdfView {

        public static ByteArrayInputStream generateReport(
                        String repid,
                        EmployeeRepository employeeRepository,
                        ExpenseRepository expenseRepository,
                        ReportRepository reportRepository) throws IOException {

                ByteArrayOutputStream baos = new ByteArrayOutputStream();

                try {

                        PdfWriter writer = new PdfWriter(baos);
                        PdfDocument pdf = new PdfDocument(writer);
                        Document document = new Document(pdf);

                        PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);

                        URL imageUrl = ReportPDFGenerator.class.getResource("/static/images/Expenses.png");
                        Image img = new Image(ImageDataFactory.create(imageUrl))
                                        .setHorizontalAlignment(HorizontalAlignment.CENTER);
                        document.add(img);
                        document.add(new Paragraph(String.format("Report ID #" + repid))
                                        .setFont(font).setFontSize(12)
                                        .setTextAlignment(TextAlignment.CENTER).setBold());

                        // Table created, but not added yet
                        Table table = new Table(4);
                        table.setWidth(new UnitValue(UnitValue.PERCENT, 100));

                        // Headers
                        Cell cell = new Cell().add(new Paragraph("ID")
                                        .setFont(font).setFontSize(12).setBold())
                                        .setTextAlignment(TextAlignment.CENTER);
                        table.addCell(cell);
                        cell = new Cell().add(new Paragraph("Date Incurred")
                                        .setFont(font).setFontSize(12).setBold())
                                        .setTextAlignment(TextAlignment.CENTER);
                        table.addCell(cell);
                        cell = new Cell().add(new Paragraph("Description")
                                        .setFont(font).setFontSize(12).setBold())
                                        .setTextAlignment(TextAlignment.CENTER);
                        table.addCell(cell);
                        cell = new Cell().add(new Paragraph("Amount")
                                        .setFont(font).setFontSize(12).setBold())
                                        .setTextAlignment(TextAlignment.CENTER);
                        table.addCell(cell);

                        // Table Data
                        Optional<Report> nullableReport = reportRepository.findById(Long.parseLong(repid));
                        if (nullableReport.isPresent()) {

                                Report report = nullableReport.get();
                                report.getEmployeeid();

                                Optional<Employee> nullableEmployee = employeeRepository
                                                .findById(report.getEmployeeid());
                                if (nullableEmployee.isPresent()) {

                                        // Employee data
                                        Employee employee = nullableEmployee.get();
                                        String employeeInfo = "Employee: "
                                                        + employee.getFirstname()
                                                        + " "
                                                        + employee.getLastname()
                                                        + " ("
                                                        + employee.getEmail() + ")";

                                        document.add(new Paragraph(employeeInfo)
                                                        .setFont(font).setFontSize(12)
                                                        .setTextAlignment(TextAlignment.CENTER).setBold());
                                }

                                BigDecimal totalExpense = new BigDecimal(0);
                                for (ReportItem item : report.getItems()) {
                                        Optional<Expense> nullableExpense = expenseRepository
                                                        .findById(item.getExpenseid());
                                        if (!nullableEmployee.isPresent()) {
                                                continue;
                                        }

                                        Expense expense = nullableExpense.get();
                                        totalExpense = totalExpense.add(expense.getAmount(),
                                                        new MathContext(8, RoundingMode.UP));

                                        String expenseId = "" + item.getExpenseid();
                                        String expenseDate = expense.getDateincurred();
                                        String expenseDescription = expense.getDescription();

                                        Locale locale = Locale.of("en", "US");
                                        NumberFormat numberFormatter = NumberFormat.getCurrencyInstance(locale);
                                        String expenseAmount = numberFormatter.format(expense.getAmount());

                                        // Rows
                                        cell = new Cell().add(new Paragraph(expenseId)
                                                        .setFont(font).setFontSize(12)
                                                        .setTextAlignment(TextAlignment.CENTER));
                                        table.addCell(cell);
                                        cell = new Cell().add(new Paragraph(expenseDate)
                                                        .setFont(font).setFontSize(12)
                                                        .setTextAlignment(TextAlignment.CENTER));
                                        table.addCell(cell);
                                        cell = new Cell().add(new Paragraph(expenseDescription)
                                                        .setFont(font).setFontSize(12)
                                                        .setTextAlignment(TextAlignment.CENTER));
                                        table.addCell(cell);
                                        cell = new Cell().add(new Paragraph(expenseAmount)
                                                        .setFont(font).setFontSize(12)
                                                        .setTextAlignment(TextAlignment.RIGHT));
                                        table.addCell(cell);
                                }

                                cell = new Cell(1, 3).add(new Paragraph("Total:")
                                                .setFont(font).setFontSize(12).setBold()
                                                .setTextAlignment(TextAlignment.RIGHT));
                                table.addCell(cell);
                                cell = new Cell().add(new Paragraph(totalExpense.toString())
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
