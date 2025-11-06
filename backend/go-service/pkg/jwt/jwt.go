package jwt

import (
	"log"
	"time"

	"github.com/golang-jwt/jwt"
)

const (
	AccessTokenTTL  = time.Hour * 24
	RefreshTokenTTL = time.Hour * 24 * 30
)

//go:generate mockery --name=Manager
type Manager interface {
	Verify(token string) (Payload, error)
	Sign(payload Payload) (string, error)
}

type Payload struct {
	jwt.StandardClaims
	UserID       string `json:"sub"`
	ShopID       string `json:"shop_id"`
	ShopUsername string `json:"shop_username"`
	ShopPrefix   string `json:"shop_prefix"`
	Type         string `json:"type"`
	Refresh      bool   `json:"refresh"`
}

type implManager struct {
	secretKey string
}

func NewManager(secretKey string) Manager {
	return &implManager{
		secretKey: secretKey,
	}
}

// Verify verifies the token and returns the payload
func (m implManager) Verify(token string) (Payload, error) {
	if token == "" {
		return Payload{}, ErrInvalidToken
	}

	keyFunc := func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			log.Printf("jwt.ParseWithClaims: %v", ErrInvalidToken)
			return nil, ErrInvalidToken
		}
		return []byte(m.secretKey), nil
	}

	jwtToken, err := jwt.ParseWithClaims(token, &Payload{}, keyFunc)
	if err != nil {
		log.Printf("jwt.ParseWithClaims: %v", err)
		return Payload{}, ErrInvalidToken
	}

	payload, ok := jwtToken.Claims.(*Payload)
	if !ok {
		log.Printf("Parsing to Payload: %v", ErrInvalidToken)
		return Payload{}, ErrInvalidToken
	}

	return *payload, nil
}

func (m implManager) Sign(payload Payload)  (string, error) {
	now := time.Now()
	claims := Payload{
		StandardClaims: jwt.StandardClaims{
			IssuedAt:  now.Unix(),
			ExpiresAt: now.Add(AccessTokenTTL).Unix(),
			Subject:   payload.UserID,
		},
		UserID:       payload.UserID,
		ShopID:       payload.ShopID,
		ShopUsername: "shopUsername",
		ShopPrefix:   "shopPrefix",
		Type:         payload.Type,
		Refresh:      payload.Type == "refresh",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedStr, err := token.SignedString([]byte(m.secretKey))
	if err != nil {
		log.Printf("jwt.SignedString: %v", err)
		return "", err
	}
	return signedStr, nil
}
