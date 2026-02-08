package validation

import (
	"net/http"
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

type FieldError struct {
	Field   string `json:"field"`
	Rule    string `json:"rule"`
	Message string `json:"message"`
}

func ValidateStruct(payload any) error {
	engine := binding.Validator.Engine()
	validatorEngine, ok := engine.(*validator.Validate)
	if !ok || validatorEngine == nil {
		return nil
	}
	return validatorEngine.Struct(payload)
}

func WriteValidationError(c *gin.Context, payload any, err error) {
	verrs, ok := err.(validator.ValidationErrors)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	fieldErrors := make([]FieldError, 0, len(verrs))
	for _, verr := range verrs {
		field := jsonFieldName(payload, verr.StructField())
		if field == "" {
			field = strings.ToLower(verr.StructField())
		}
		rule := verr.Tag()
		message := validationMessage(field, rule)
		fieldErrors = append(fieldErrors, FieldError{
			Field:   field,
			Rule:    rule,
			Message: message,
		})
	}

	c.JSON(http.StatusBadRequest, gin.H{
		"error":   "validation_failed",
		"fields":  fieldErrors,
		"message": "invalid input",
	})
}

func jsonFieldName(payload any, field string) string {
	payloadType := reflect.TypeOf(payload)
	if payloadType == nil {
		return ""
	}
	if payloadType.Kind() == reflect.Pointer {
		payloadType = payloadType.Elem()
	}
	if payloadType.Kind() != reflect.Struct {
		return ""
	}
	structField, ok := payloadType.FieldByName(field)
	if !ok {
		return ""
	}
	tag := structField.Tag.Get("json")
	if tag == "" {
		return ""
	}
	name := strings.Split(tag, ",")[0]
	if name == "-" {
		return ""
	}
	return name
}

func validationMessage(field string, rule string) string {
	switch rule {
	case "required":
		return field + " is required"
	case "email":
		return field + " must be a valid email"
	case "min":
		return field + " is too short"
	default:
		return field + " is invalid"
	}
}
