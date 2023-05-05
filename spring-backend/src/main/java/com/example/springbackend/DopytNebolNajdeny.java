package com.example.springbackend;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class DopytNebolNajdeny extends RuntimeException{

    private static final long serialVersionUID = 1L;

    public DopytNebolNajdeny(String message) {
        super(message);
    }
}