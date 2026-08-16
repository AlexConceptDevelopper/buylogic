package com.buylogic.config;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.model.AppUser;
import com.buylogic.model.Company;
import com.buylogic.model.Role;
import com.buylogic.repository.global.AppUserRepository;
import com.buylogic.repository.global.CompanyRepository;

import tools.jackson.databind.ObjectMapper;

@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    private final CompanyRepository companyRepository;
    private final AppUserRepository appUserRepository;

    private final ObjectMapper mapper =
            new ObjectMapper();

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public DataSeeder(
            CompanyRepository companyRepository,
            AppUserRepository appUserRepository) {

        this.companyRepository = companyRepository;
        this.appUserRepository = appUserRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        if (companyRepository.count() > 0) {

            System.out.println(
                    "⚠️ BuyLogic : données déjà présentes, seed ignoré."
            );

            return;
        }

        System.out.println(
                "========== BUYLOGIC DATA SEED =========="
        );

        Map<String, Company> companies =
                seedCompanies();

        seedUsers(companies);

        printSummary();

        System.out.println(
                "========== BUYLOGIC SEED TERMINE =========="
        );
    }

    // =========================================================
    // COMPANIES
    // =========================================================

    private Map<String, Company> seedCompanies()
            throws Exception {

        List<Map<String, Object>> data =
                readJson("seed/companies.json");

        Map<String, Company> companies =
                new HashMap<>();

        for (Map<String, Object> entry : data) {

            Company company =
                    new Company();

            company.setName(
                    getRequiredString(
                            entry,
                            "name",
                            "companies.json"
                    )
            );

            company.setEmail(
                    getRequiredString(
                            entry,
                            "email",
                            "companies.json"
                    )
            );

            company.setActive(
                    getBoolean(
                            entry,
                            "active",
                            true
                    )
            );

            company =
                    companyRepository.save(company);

            companies.put(
                    company.getEmail(),
                    company
            );
        }

        System.out.println(
                "✅ Companies seedées : "
                        + data.size()
        );

        return companies;
    }

    // =========================================================
    // USERS
    // =========================================================

    private void seedUsers(
            Map<String, Company> companies)
            throws Exception {

        List<Map<String, Object>> data =
                readJson("seed/users.json");

        for (Map<String, Object> entry : data) {

            String companyEmail =
                    getRequiredString(
                            entry,
                            "companyEmail",
                            "users.json"
                    );

            Company company =
                    companies.get(companyEmail);

            if (company == null) {

                throw new RuntimeException(
                        "Entreprise introuvable : "
                                + companyEmail
                );
            }

            AppUser user =
                    new AppUser();

            user.setCompany(company);

            user.setEmail(
                    getRequiredString(
                            entry,
                            "email",
                            "users.json"
                    )
            );

            String password =
                    getRequiredString(
                            entry,
                            "password",
                            "users.json"
                    );

            user.setPasswordHash(
                    passwordEncoder.encode(
                            password
                    )
            );

            user.setFirstName(
                    (String) entry.get(
                            "firstName"
                    )
            );

            user.setLastName(
                    (String) entry.get(
                            "lastName"
                    )
            );

            user.setRole(
                    Role.valueOf(
                            getRequiredString(
                                    entry,
                                    "role",
                                    "users.json"
                            ).toUpperCase()
                    )
            );

            user.setActive(
                    getBoolean(
                            entry,
                            "active",
                            true
                    )
            );

            appUserRepository.save(user);
        }

        System.out.println(
                "✅ Utilisateurs seedés : "
                        + data.size()
        );
    }

    // =========================================================
    // JSON
    // =========================================================

    private List<Map<String, Object>> readJson(
            String path)
            throws Exception {

        InputStream inputStream =
                new ClassPathResource(path)
                        .getInputStream();

        return mapper.readValue(
                inputStream,
                mapper.getTypeFactory()
                        .constructCollectionType(
                                List.class,
                                Map.class
                        )
        );
    }

    // =========================================================
    // HELPERS
    // =========================================================

    private String getRequiredString(
            Map<String, Object> data,
            String field,
            String file) {

        Object value =
                data.get(field);

        if (value == null) {

            throw new RuntimeException(
                    "Champ '"
                            + field
                            + "' manquant dans "
                            + file
                            + " : "
                            + data
            );
        }

        return value.toString();
    }

    private Boolean getBoolean(
            Map<String, Object> data,
            String field,
            boolean defaultValue) {

        Object value =
                data.get(field);

        if (value == null) {
            return defaultValue;
        }

        if (value instanceof Boolean) {
            return (Boolean) value;
        }

        return Boolean.parseBoolean(
                value.toString()
        );
    }

    // =========================================================
    // SUMMARY
    // =========================================================

    private void printSummary() {

        System.out.println(
                "----------------------------------------"
        );

        System.out.println(
                "Companies : "
                        + companyRepository.count()
        );

        System.out.println(
                "Users     : "
                        + appUserRepository.count()
        );

        System.out.println(
                "----------------------------------------"
        );
    }
}