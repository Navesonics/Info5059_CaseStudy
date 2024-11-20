package com.info5059.serverexercises.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class ReportController {

    @Autowired
    private ReportDAO reportDAO;

    @PostMapping("/api/reports")
    public ResponseEntity<Report> addOne(@RequestBody Report report) {
        return new ResponseEntity<Report>(reportDAO.create(report), HttpStatus.OK);
    }

}

