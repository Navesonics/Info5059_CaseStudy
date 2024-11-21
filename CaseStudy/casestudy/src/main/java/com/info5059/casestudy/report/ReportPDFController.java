package com.info5059.casestudy.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.info5059.casestudy.vendor.VendorRepository;
import com.info5059.casestudy.product.ProductRepository;
import com.info5059.casestudy.purchaseorder.PurchaseOrderRepository;
import com.itextpdf.io.exceptions.IOException;

import jakarta.servlet.http.HttpServletRequest;

import java.io.ByteArrayInputStream;

@CrossOrigin
@RestController
public class ReportPDFController {

    @Autowired
    private PurchaseOrderRepository poRepository;
    @Autowired
    private VendorRepository vendorRepository;
    @Autowired
    private ProductRepository productRepository;

    @RequestMapping(value = "/ReportPDF", method = RequestMethod.GET, produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> getPdf(HttpServletRequest request) throws IOException {

        // get formatted pdf as a stream
        String repid = request.getParameter("repid");
        ByteArrayInputStream bis = ReportPDFGenerator.generateReport(
                repid,
                vendorRepository,
                productRepository,
                poRepository);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=report-" + repid + ".pdf");

        // dump stream to browser
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

}
