package com.info5059.casestudy.purchaseorder;

import java.time.LocalDateTime;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;

@Component
public class PurchaseOrderDAO {
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private ProductRepository prodRepo;

    @Transactional
    public PurchaseOrder create(PurchaseOrder poFromClient) {
        PurchaseOrder realPO = new PurchaseOrder();
        realPO.setVendorid(poFromClient.getVendorid());
        realPO.setPodate(LocalDateTime.now());
        realPO.setAmount(poFromClient.getAmount());
        entityManager.persist(realPO);

        for (PurchaseOrderLineItem item : poFromClient.getItems()) {
            PurchaseOrderLineItem realItem = new PurchaseOrderLineItem();
            realItem.setProductid(item.getProductid());
            realItem.setPrice(item.getPrice());
            realItem.setQty(item.getQty());
            realItem.setPoid(realPO.getId());
            entityManager.persist(realItem);

            // Update product QOO
            Product prod = prodRepo.getReferenceById(item.getProductid());
            prod.setQoo(prod.getQoo() + item.getQty());
            prodRepo.saveAndFlush(prod);
        }

        entityManager.flush();
        entityManager.refresh(realPO);
        return realPO;
    }
}
