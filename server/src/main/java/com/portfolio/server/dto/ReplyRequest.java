package com.portfolio.server.dto;

import jakarta.validation.constraints.NotBlank;

public class ReplyRequest {

    @NotBlank(message = "Reply message is required")
    private String message;

    public ReplyRequest() {}

    public ReplyRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
