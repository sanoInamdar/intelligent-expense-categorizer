package com.expense.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExpenseResponse {
    private String merchant;
    private String amount;
    private String date;
    private String category;
}
