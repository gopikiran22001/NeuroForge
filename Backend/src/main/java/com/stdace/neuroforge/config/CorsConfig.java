package com.stdace.neuroforge.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Allow your frontend origin (adjust for production)
                .allowedOrigins(
                        "http://localhost:5173",      // Vite dev server
                        "http://localhost:3000",      // Alternative frontend
                        "http://127.0.0.1:5173",
                        "http://127.0.0.1:3000"
                )
                // Allow all HTTP methods
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                // Allow all headers
                .allowedHeaders("*")
                // ✅ CRITICAL for cookies: allow credentials
                .allowCredentials(true)
                // Cache preflight for 1 hour
                .maxAge(3600);
    }
}

