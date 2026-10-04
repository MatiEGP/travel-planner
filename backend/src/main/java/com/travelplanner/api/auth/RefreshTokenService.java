package com.travelplanner.api.auth;

import com.travelplanner.api.config.JwtConfig;
import com.travelplanner.api.usuarios.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtConfig jwtConfig;

    /**
     * Creates a new refresh token with the configured default expiration (e.g. 7 days from now).
     * Used on first login.
     */
    @Transactional
    public RefreshToken createRefreshToken(Usuario usuario) {
        RefreshToken refreshToken = RefreshToken.builder()
                .usuario(usuario)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(jwtConfig.getRefreshExpirationMs()))
                .revoked(false)
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Creates a new refresh token preserving the original absolute expiry date.
     * Used on token rotation to enforce absolute expiration.
     */
    @Transactional
    public RefreshToken createRefreshToken(Usuario usuario, Instant absoluteExpiryDate) {
        RefreshToken refreshToken = RefreshToken.builder()
                .usuario(usuario)
                .token(UUID.randomUUID().toString())
                .expiryDate(absoluteExpiryDate)
                .revoked(false)
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token is expired. Please sign in again.");
        }
        if (token.isRevoked()) {
            throw new RuntimeException("Refresh token is revoked.");
        }
        return token;
    }

    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }

    /**
     * Returns the configured refresh token duration in seconds (for cookie Max-Age).
     */
    public long getRefreshExpirationSeconds() {
        return jwtConfig.getRefreshExpirationMs() / 1000;
    }

    /**
     * Returns the configured access token duration in seconds (for cookie Max-Age).
     */
    public long getAccessTokenExpirationSeconds() {
        return jwtConfig.getExpirationMs() / 1000;
    }
}
