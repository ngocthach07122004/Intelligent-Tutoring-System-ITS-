package mongo

import (
	"context"
	"errors"
	"fmt"
	"sort"
	"strings"
	"sync"

	"init-src/internal/models"
	"init-src/internal/user"
	"init-src/pkg/log"
	pkgMongo "init-src/pkg/mongo"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	errUserNotFound = errors.New("user not found")
)

type repository struct {
	l     log.Logger
	mu    sync.RWMutex
	users map[string]models.User
}

// New returns an in-memory user repository. We still accept a mongo handle to keep
// the signature identical to the previous implementation, but the handle is not used.
func New(l log.Logger, _ pkgMongo.Database) user.Repository {
	repo := &repository{
		l:     l,
		users: map[string]models.User{},
	}
	repo.seed()
	return repo
}

func (r *repository) seed() {
	bootstrap := []user.CreateInput{
		{Username: "alicia", Name: "Alicia Nguyen", Avatar: "https://i.pravatar.cc/150?img=1", Role: "manager"},
		{Username: "bao", Name: "Bao Tran", Avatar: "https://i.pravatar.cc/150?img=2", Role: "head_of_department"},
		{Username: "carlos", Name: "Carlos Vo", Avatar: "https://i.pravatar.cc/150?img=3", Role: "instructor"},
		{Username: "diana", Name: "Diana Pham", Avatar: "https://i.pravatar.cc/150?img=4", Role: "student"},
		{Username: "ethan", Name: "Ethan Ho", Avatar: "https://i.pravatar.cc/150?img=5", Role: "student"},
	}

	for _, input := range bootstrap {
		if _, err := r.Create(context.Background(), input); err != nil {
			r.l.Warnf(context.Background(), "user.repository.seed failed: %v", err)
		}
	}
}

func (r *repository) List(ctx context.Context) ([]models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	users := make([]models.User, 0, len(r.users))
	for _, u := range r.users {
		users = append(users, u)
	}

	sort.Slice(users, func(i, j int) bool {
		return strings.Compare(users[i].Name, users[j].Name) < 0
	})

	return users, nil
}

func (r *repository) GetUser(ctx context.Context, id string) (models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if u, ok := r.users[id]; ok {
		return u, nil
	}

	return models.User{}, errUserNotFound
}

func (r *repository) GetUsers(ctx context.Context, ids []string) ([]models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if len(ids) == 0 {
		return nil, nil
	}

	unique := make(map[string]struct{}, len(ids))
	for _, id := range ids {
		if id == "" {
			continue
		}
		unique[id] = struct{}{}
	}

	users := make([]models.User, 0, len(unique))
	for id := range unique {
		if u, ok := r.users[id]; ok {
			users = append(users, u)
		}
	}

	return users, nil
}

func (r *repository) Create(ctx context.Context, input user.CreateInput) (models.User, error) {
	if strings.TrimSpace(input.Username) == "" {
		return models.User{}, fmt.Errorf("username is required")
	}
	if strings.TrimSpace(input.Name) == "" {
		return models.User{}, fmt.Errorf("name is required")
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	for _, existing := range r.users {
		if strings.EqualFold(existing.Username, input.Username) {
			return models.User{}, fmt.Errorf("username already exists")
		}
	}

	id := primitive.NewObjectID()
	avatar := input.Avatar
	if avatar == "" {
		avatar = fmt.Sprintf("https://i.pravatar.cc/150?u=%s", input.Username)
	}

	userModel := models.User{
		ID:       id,
		Username: input.Username,
		Name:     input.Name,
		Avatar:   avatar,
		Role:     defaultRole(input.Role),
	}

	r.users[id.Hex()] = userModel
	return userModel, nil
}

func (r *repository) Update(ctx context.Context, id string, input user.UpdateInput) (models.User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	current, ok := r.users[id]
	if !ok {
		return models.User{}, errUserNotFound
	}

	if input.Username != nil {
		current.Username = *input.Username
	}
	if input.Name != nil {
		current.Name = *input.Name
	}
	if input.Avatar != nil {
		current.Avatar = *input.Avatar
	}
	if input.Role != nil {
		current.Role = defaultRole(*input.Role)
	}

	r.users[id] = current
	return current, nil
}

func (r *repository) Delete(ctx context.Context, id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.users[id]; !ok {
		return errUserNotFound
	}

	delete(r.users, id)
	return nil
}

func defaultRole(role string) string {
	if strings.TrimSpace(role) == "" {
		return "student"
	}
	return role
}
