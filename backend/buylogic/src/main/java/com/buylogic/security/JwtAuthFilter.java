package com.buylogic.security;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.buylogic.repository.global.CompanyRepository;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

        private final JwtUtil jwtUtil;
        private final CompanyRepository companyRepository;

        public JwtAuthFilter(JwtUtil jwtUtil, CompanyRepository companyRepository) {
                this.jwtUtil = jwtUtil;
                this.companyRepository = companyRepository;
        }

        @Override
        protected void doFilterInternal(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        FilterChain filterChain) throws ServletException, IOException {

                String authorizationHeader = request.getHeader("Authorization");

                if (authorizationHeader == null
                                || !authorizationHeader.startsWith("Bearer ")) {
                        filterChain.doFilter(request, response);
                        return;
                }

                String token = authorizationHeader.substring(7);

                if (!jwtUtil.isTokenValid(token)) {
                        filterChain.doFilter(request, response);
                        return;
                }

                Integer companyId = jwtUtil.extractCompanyId(token);

                // --- VÉRIFICATION DU STATUT DE L'ENTREPRISE ---
                if (companyId != null) {
                        boolean isCompanyActive = companyRepository.findById(companyId)
                                        .map(company -> company.getActive() != null && company.getActive())
                                        .orElse(false);

                        if (!isCompanyActive) {
                                response.sendError(HttpServletResponse.SC_FORBIDDEN,
                                                "L'entreprise associée est désactivée.");
                                return;
                        }
                }
                // ---------------------------------------------

                Integer userId = jwtUtil.extractUserId(token);
                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);

                JwtPrincipal principal = new JwtPrincipal(
                                userId,
                                email,
                                role,
                                companyId);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                List.of(
                                                new SimpleGrantedAuthority(
                                                                "ROLE_" + role)));

                authentication.setDetails(
                                new WebAuthenticationDetailsSource()
                                                .buildDetails(request));

                SecurityContextHolder
                                .getContext()
                                .setAuthentication(authentication);

                filterChain.doFilter(request, response);
        }

        public record JwtPrincipal(
                        Integer userId,
                        String email,
                        String role,
                        Integer companyId) {
        }
}