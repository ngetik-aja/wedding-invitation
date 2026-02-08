package admin

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/validation"
	adminsvc "github.com/proxima-labs/wedding-invitation-back-end/src/service/admin"
)

type AuthHandler struct {
	Service *adminsvc.AuthService
}

type loginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type loginResponse struct {
	AccessToken string `json:"accessToken"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		validation.WriteValidationError(c, req, err)
		return
	}

	if err := validation.ValidateStruct(req); err != nil {
		validation.WriteValidationError(c, req, err)
		return
	}

	userAgent := c.GetHeader("User-Agent")
	ip := c.ClientIP()
	accessToken, refreshToken, refreshExpires, err := h.Service.Login(c.Request.Context(), strings.ToLower(req.Email), req.Password, userAgent, ip)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	setRefreshCookie(c, refreshToken, refreshExpires.Unix())
	c.JSON(http.StatusOK, loginResponse{AccessToken: accessToken})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("admin_refresh")
	if err != nil || refreshToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing refresh"})
		return
	}

	accessToken, refreshExpires, err := h.Service.Refresh(c.Request.Context(), refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh"})
		return
	}

	setRefreshCookie(c, refreshToken, refreshExpires.Unix())
	c.JSON(http.StatusOK, loginResponse{AccessToken: accessToken})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	refreshToken, _ := c.Cookie("admin_refresh")
	_ = h.Service.Logout(c.Request.Context(), refreshToken)
	setRefreshCookie(c, "", 0)
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func setRefreshCookie(c *gin.Context, value string, expiresUnix int64) {
	domain := os.Getenv("ADMIN_COOKIE_DOMAIN")
	secure := strings.EqualFold(os.Getenv("ADMIN_COOKIE_SECURE"), "true")
	sameSite := http.SameSiteLaxMode
	if strings.EqualFold(os.Getenv("ADMIN_COOKIE_SAMESITE"), "none") {
		sameSite = http.SameSiteNoneMode
	}

	cookie := &http.Cookie{
		Name:     "admin_refresh",
		Value:    value,
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: sameSite,
		Domain:   domain,
	}
	if value == "" || expiresUnix == 0 {
		cookie.MaxAge = -1
	} else {
		cookie.Expires = time.Unix(expiresUnix, 0)
		cookie.MaxAge = int(time.Until(cookie.Expires).Seconds())
	}

	http.SetCookie(c.Writer, cookie)
}
