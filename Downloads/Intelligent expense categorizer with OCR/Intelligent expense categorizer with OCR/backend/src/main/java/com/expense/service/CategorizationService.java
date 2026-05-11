package com.expense.service;

import com.expense.model.ExpenseResponse;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.List;
import java.util.Arrays;

@Service
public class CategorizationService {

    private static final List<String> FOOD_KEYWORDS = Arrays.asList("domino's", "pizza hut", "starbucks", "mcdonald's", "kfc", "restaurant", "cafe", "food");
    private static final List<String> TRAVEL_KEYWORDS = Arrays.asList("uber", "ola", "taxi", "lyft", "airlines", "railway", "irctc", "bus");
    private static final List<String> SHOPPING_KEYWORDS = Arrays.asList("amazon", "flipkart", "myntra", "walmart", "target", "mall", "clothing");
    private static final List<String> MEDICAL_KEYWORDS = Arrays.asList("apollo", "pharmacy", "hospital", "clinic", "medical", "doctor");

    public ExpenseResponse categorizeExpense(String text) {
        if (text == null || text.trim().isEmpty()) {
            return ExpenseResponse.builder()
                    .merchant("Unknown")
                    .amount("0.00")
                    .date("Unknown")
                    .category("Others")
                    .build();
        }

        String lowerText = text.toLowerCase();
        
        String merchant = extractMerchant(lowerText);
        String amount = extractAmount(text);
        String date = extractDate(text);
        String category = determineCategory(lowerText, merchant.toLowerCase());

        return ExpenseResponse.builder()
                .merchant(merchant)
                .amount(amount)
                .date(date)
                .category(category)
                .build();
    }

    private String extractMerchant(String lowerText) {
        // Simple heuristic: Look for known merchants first
        String[] allKeywords = {
            "domino's pizza", "domino's", "pizza hut", "starbucks", "uber", "ola", "amazon", "flipkart", "apollo pharmacy"
        };
        
        for (String keyword : allKeywords) {
            if (lowerText.contains(keyword)) {
                // Return capitalized version
                return Arrays.stream(keyword.split(" "))
                             .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1))
                             .reduce((a, b) -> a + " " + b)
                             .orElse(keyword);
            }
        }
        
        // If no known merchant, try to take the first line as merchant
        String[] lines = lowerText.split("\\r?\\n");
        if (lines.length > 0 && !lines[0].trim().isEmpty()) {
            String firstLine = lines[0].trim();
            if (firstLine.length() > 2) {
                 return Arrays.stream(firstLine.split(" "))
                             .map(word -> word.length() > 0 ? word.substring(0, 1).toUpperCase() + word.substring(1) : "")
                             .reduce((a, b) -> a + " " + b)
                             .orElse(firstLine);
            }
        }

        return "Unknown Merchant";
    }

    private String extractAmount(String text) {
        // Regex to find amounts like $12.34, ₹540, 540.00, etc.
        // It looks for optional currency symbols, followed by numbers and optional decimals
        Pattern pattern = Pattern.compile("(?i)(?:total|amount|sum|price)?[\\s:]*(?:[$₹€£])?\\s*(\\d+(?:[.,]\\d{2})?)");
        Matcher matcher = pattern.matcher(text);
        
        String lastAmount = "0.00";
        while (matcher.find()) {
            lastAmount = matcher.group(1); // Usually the largest or last one is the total
        }
        return lastAmount;
    }

    private String extractDate(String text) {
        // Regex for dates like YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, DD-MM-YYYY
        Pattern pattern = Pattern.compile("\\b(?:\\d{4}[-/]\\d{2}[-/]\\d{2}|\\d{2}[-/]\\d{2}[-/]\\d{4})\\b");
        Matcher matcher = pattern.matcher(text);
        
        if (matcher.find()) {
            return matcher.group(0);
        }
        return "Unknown Date";
    }

    private String determineCategory(String lowerText, String merchantLower) {
        if (containsAny(lowerText, FOOD_KEYWORDS) || containsAny(merchantLower, FOOD_KEYWORDS)) return "Food";
        if (containsAny(lowerText, TRAVEL_KEYWORDS) || containsAny(merchantLower, TRAVEL_KEYWORDS)) return "Travel";
        if (containsAny(lowerText, SHOPPING_KEYWORDS) || containsAny(merchantLower, SHOPPING_KEYWORDS)) return "Shopping";
        if (containsAny(lowerText, MEDICAL_KEYWORDS) || containsAny(merchantLower, MEDICAL_KEYWORDS)) return "Medical";
        
        return "Others";
    }

    private boolean containsAny(String text, List<String> keywords) {
        return keywords.stream().anyMatch(text::contains);
    }
}
