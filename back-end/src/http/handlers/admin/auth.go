package admin

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	adminRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request/admin"
)

type loginResponse struct {
	AccessToken string `json:"accessToken"`
}

func LoginHandler(c *gin.Context) {
	if !ensureService(c, authService) {
		return
	}

	req, payload, err := adminRequest.NewLoginRequest(c)
	if err != nil {
		httpRequest.WriteValidationError(c, payload, err)
		return
	}

	userAgent := c.GetHeader("User-Agent")
	ip := c.ClientIP()
	accessToken, refreshToken, refreshExpires, err := authService.Login(c.Request.Context(), strings.ToLower(req.Email), req.Password, userAgent, ip)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	setRefreshCookie(c, refreshToken, refreshExpires.Unix())
	c.JSON(http.StatusOK, loginResponse{AccessToken: accessToken})
}

func RefreshHandler(c *gin.Context) {
	if !ensureService(c, authService) {
		return
	}

	refreshToken, err := c.Cookie("admin_refresh")
	if err != nil || refreshToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing refresh"})
		return
	}

	accessToken, refreshExpires, err := authService.Refresh(c.Request.Context(), refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh"})
		return
	}

	setRefreshCookie(c, refreshToken, refreshExpires.Unix())
	c.JSON(http.StatusOK, loginResponse{AccessToken: accessToken})
}

func LogoutHandler(c *gin.Context) {
	if !ensureService(c, authService) {
		return
	}

	refreshToken, _ := c.Cookie("admin_refresh")
	_ = authService.Logout(c.Request.Context(), refreshToken)
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
