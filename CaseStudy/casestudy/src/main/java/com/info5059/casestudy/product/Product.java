package com.info5059.casestudy.product;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.math.BigDecimal;
import jakarta.persistence.Basic;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
@Data
@RequiredArgsConstructor

public class Product {

    @Id
    private String id;
    private int vendorid;
    private String name;
    private BigDecimal costprice;
    private BigDecimal msrp;
    private int rop;
    private int eoq;
    private int qoh;
    private int qoo;

    // needed in 2nd case study
    @Basic(optional = true)
    @Lob
    private String qrcode;
    private String qrcodetxt;
}
