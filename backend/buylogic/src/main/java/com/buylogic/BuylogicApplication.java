package com.buylogic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
@ConfigurationPropertiesScan
public class BuylogicApplication {

	public static void main(String[] args) {
		SpringApplication.run(BuylogicApplication.class, args);
	}
}
