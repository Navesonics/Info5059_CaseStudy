//ReportDAO.java
package com.info5059.serverexercises.report;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;

@Component
public class ReportDAO {
    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public Report create(Report reportFromClient) {
        Report realReport = new Report();
        realReport.setDatecreated(LocalDateTime.now());
        realReport.setEmployeeid(reportFromClient.getEmployeeid());
        entityManager.persist(realReport); // Save the report to get the generated ID

        // Now persist each ReportItem and link it to the realReport
        for (ReportItem item : reportFromClient.getItems()) {
            ReportItem realItem = new ReportItem();
            realItem.setExpenseid(item.getExpenseid());
            realItem.setReportid(realReport.getId()); // Set the generated report ID
            entityManager.persist(realItem); // Save the item
        }

        entityManager.flush();
        entityManager.refresh(realReport); // Refresh the report to update with items
        return realReport; // Return the persisted report
    }

}
