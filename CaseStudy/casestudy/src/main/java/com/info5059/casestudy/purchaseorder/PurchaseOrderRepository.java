package com.info5059.casestudy.purchaseorder;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "purchaseorders", path = "purchaseorders")
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    @Modifying
    @Transactional
    @Query("delete from PurchaseOrder where id = ?1")
    int deleteOne(Long vendorid);

    List<PurchaseOrder> findByVendorid(Long vendorid);
}