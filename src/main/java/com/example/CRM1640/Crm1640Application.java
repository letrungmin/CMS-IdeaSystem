package com.example.CRM1640;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableAsync
public class Crm1640Application {

	public static void main(String[] args) {
		SpringApplication.run(Crm1640Application.class, args);
	}

}
