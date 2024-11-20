package com.info5059.casestudy.purchaseorder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api/purchaseorders")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderDAO purchaseOrderDAO;

    @PostMapping
    public ResponseEntity<PurchaseOrder> addOne(@RequestBody PurchaseOrder po) {
        return new ResponseEntity<>(purchaseOrderDAO.create(po), HttpStatus.OK);
    }
}
