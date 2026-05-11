package com.expense.controller;

import com.expense.model.ExpenseRequest;
import com.expense.model.ExpenseResponse;
import com.expense.service.CategorizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categorize")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ExpenseController {

    private final CategorizationService categorizationService;

    @PostMapping
    public ResponseEntity<ExpenseResponse> categorize(@RequestBody ExpenseRequest request) {
        ExpenseResponse response = categorizationService.categorizeExpense(request.getText());
        return ResponseEntity.ok(response);
    }
}
