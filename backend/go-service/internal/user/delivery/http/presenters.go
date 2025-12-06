package http

import (
	"strings"

	"init-src/internal/models"
	"init-src/internal/user"
	"init-src/pkg/paginator"
	"init-src/pkg/response"
)

// SignupRequest represents the request body for user signup
type SignupRequest struct {
	// Username of the user
	Username string `json:"username" binding:"required"`
	// Email address of the user
	Email string `json:"email" binding:"required,email"`
	// Password for the user account
	Password string `json:"password" binding:"required,min=8"`
}

// LoginRequest represents the request body for user login
type LoginRequest struct {
	// Email address of the user
	Email string `json:"email" binding:"required,email"`
	// Password for the user account
	Password string `json:"password" binding:"required"`
	// ID of the shop the user belongs to
	ShopID string `json:"shop_id"`
}

// CreateRequest represents the request body for creating a user
type CreateRequest struct {
	// Username of the user
	Username string `json:"username" binding:"required"`
	// Email address of the user
	Email string `json:"email" binding:"required,email"`
	// Password for the user account
	Password string `json:"password" binding:"required,min=8"`
	// Role of the user
	Role string `json:"role" binding:"required"`
	// ID of the shop the user belongs to
	ShopID string `json:"shop_id"`
	// ID of the region the user belongs to
	RegionID string `json:"region_id"`
	// ID of the branch the user belongs to
	BranchID string `json:"branch_id"`
	// ID of the department the user belongs to
	DepartmentID string `json:"department_id"`
}

// UpdateRequest represents the request body for updating a user
type UpdateRequest struct {
	// Username of the user
	Username string `json:"username" binding:"required"`
	// Email address of the user
	Email string `json:"email" binding:"required,email"`
	// Password for the user account
	Password string `json:"password" binding:"required,min=8"`
	// Role of the user
	Role string `json:"role" binding:"required"`
	// ID of the shop the user belongs to
	ShopID string `json:"shop_id"`
	// ID of the region the user belongs to
	RegionID string `json:"region_id"`
	// ID of the branch the user belongs to
	BranchID string `json:"branch_id"`
	// ID of the department the user belongs to
	DepartmentID string `json:"department_id"`
}

func (r SignupRequest) validate() error {
	if strings.TrimSpace(r.Email) == "" || r.Email == "" {
		return errWrongBody
	}
	if strings.TrimSpace(r.Password) == "" || r.Password == "" {
		return errWrongBody
	}
	if strings.TrimSpace(r.Username) == "" || r.Username == "" {
		return errWrongBody
	}

	return nil
}

func (r LoginRequest) validate() error {
	if strings.TrimSpace(r.Email) == "" {
		return errWrongBody
	}
	if strings.TrimSpace(r.Password) == "" {
		return errWrongBody
	}
	// if strings.TrimSpace(r.ShopID) == "" {
	// 	return errWrongBody
	// }
	return nil
}

func (r UpdateRequest) validate() error {
	if strings.TrimSpace(r.Email) == "" {
		return errWrongBody
	}
	if strings.TrimSpace(r.Password) == "" {
		return errWrongBody
	}
	if strings.TrimSpace(r.Username) == "" {
		return errWrongBody
	}
	if strings.TrimSpace(r.Role) == "" {
		return errWrongBody
	}
	return nil
}

func (r CreateRequest) validate() error {
	if strings.TrimSpace(r.Email) == "" {
		return errWrongBody
	}
	if strings.TrimSpace(r.Password) == "" {
		return errWrongBody
	}
	if strings.TrimSpace(r.Username) == "" {
		return errWrongBody
	}
	if strings.TrimSpace(r.Role) == "" {
		return errWrongBody
	}
	return nil
}

func (r SignupRequest) toInput() user.SignUpInput {
	return user.SignUpInput{
		Username: r.Username,
		Email:    r.Email,
		Password: r.Password,
	}
}

func (r CreateRequest) toInput() user.CreateUserInput {
	return user.CreateUserInput{
		Username:     r.Username,
		Email:        r.Email,
		Password:     r.Password,
		Role:         r.Role,
		ShopID:       r.ShopID,
		RegionID:     r.RegionID,
		BranchID:     r.BranchID,
		DepartmentID: r.DepartmentID,
	}
}

func (r LoginRequest) toInput() user.LoginInput {
	return user.LoginInput{
		Email:    r.Email,
		Password: r.Password,
		ShopID:   r.ShopID,
	}
}

func (r UpdateRequest) toInput() user.UpdateInput {
	return user.UpdateInput{
		Username:     r.Username,
		Email:        r.Email,
		Password:     r.Password,
		Role:         r.Role,
		ShopID:       r.ShopID,
		RegionID:     r.RegionID,
		BranchID:     r.BranchID,
		DepartmentID: r.DepartmentID,
	}
}

// SignUpResponse represents the response for user signup
type SignUpResponse struct {
	// Unique identifier of the user
	ID string `json:"id"`
	// Username of the user
	Username string `json:"username"`
	// Email address of the user
	Email string `json:"email"`
	// Role of the user
	Role string `json:"role"`
	// ID of the shop the user belongs to
	ShopID string `json:"shop_id,omitempty"`
	// Creation timestamp
	CreatedAt response.DateTime `json:"created_at"`
}

// UpdateResponse represents the response for updating a user
type UpdateResponse struct {
	// Unique identifier of the user
	ID string `json:"id"`
	// Username of the user
	Username string `json:"username"`
	// Email address of the user
	Email string `json:"email"`
	// Role of the user
	Role string `json:"role"`
	// ID of the shop the user belongs to
	ShopID string `json:"shop_id,omitempty"`
	// ID of the region the user belongs to
	RegionID string `json:"region_id,omitempty"`
	// ID of the branch the user belongs to
	BranchID string `json:"branch_id,omitempty"`
	// ID of the department the user belongs to
	DepartmentID string `json:"department_id,omitempty"`
	// Creation timestamp
	CreatedAt response.DateTime `json:"created_at"`
}

// LoginResponse represents the response for user login
type LoginResponse struct {
	// JWT token for authentication
	Token string `json:"token"`
}

// GetResponse represents the response for getting users with pagination
type GetResponse struct {
	Pagin       paginator.PaginatorResponse `json:"pagin"`
	Users       []UserResponse              `json:"users"`
	Shops       []ShopResponse              `json:"shops,omitempty"`
	Regions     []RegionResponse            `json:"regions,omitempty"`
	Branches    []BranchResponse            `json:"branches,omitempty"`
	Departments []DepartmentResponse        `json:"departments,omitempty"`
}

// GetByIDResponse represents the response for getting a single user
type GetByIDResponse struct {
	User       UserResponse        `json:"user"`
	Shop       *ShopResponse       `json:"shop,omitempty"`
	Region     *RegionResponse     `json:"region,omitempty"`
	Branch     *BranchResponse     `json:"branch,omitempty"`
	Department *DepartmentResponse `json:"department,omitempty"`
}

// DeleteResponse represents the response for deleting a user
type DeleteResponse struct {
	// Success/failure message
	Message string `json:"message"`
}

type UserResponse struct {
	ID           string `json:"id"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	Role         string `json:"role"`
	ShopID       string `json:"shop_id,omitempty"`
	RegionID     string `json:"region_id,omitempty"`
	BranchID     string `json:"branch_id,omitempty"`
	DepartmentID string `json:"department_id,omitempty"`
}

type ShopResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type RegionResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type BranchResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type DepartmentResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func (h handler) newSignUpResponse(d models.User) SignUpResponse {
	return SignUpResponse{
		ID:        d.ID.Hex(),
		Username:  d.Username,
		Email:     d.Email,
		Role:      d.Role,
		ShopID:    d.ShopID.Hex(),
		CreatedAt: response.DateTime(d.CreatedAt),
	}
}

func (h handler) newUpdateResponse(d models.User) UpdateResponse {
	var departmentID, shopID, regionID, branchID string
	if d.ShopID != nil {
		shopID = d.ShopID.Hex()
	}
	if d.RegionID != nil {
		regionID = d.RegionID.Hex()
	}
	if d.BranchID != nil {
		branchID = d.BranchID.Hex()
	}
	if d.DepartmentID != nil {
		departmentID = d.DepartmentID.Hex()
	}

	return UpdateResponse{
		ID:           d.ID.Hex(),
		Username:     d.Username,
		Email:        d.Email,
		Role:         d.Role,
		ShopID:       shopID,
		RegionID:     regionID,
		BranchID:     branchID,
		DepartmentID: departmentID,
		CreatedAt:    response.DateTime(d.CreatedAt),
	}
}

func (h handler) newLoginResponse(token string) LoginResponse {
	return LoginResponse{
		Token: token,
	}
}

func (h handler) newGetResponse(output user.GetOutPut) GetResponse {
	users := make([]UserResponse, len(output.Users))
	for i, u := range output.Users {
		var shopID, regionID, branchID, departmentID string
		if u.ShopID != nil {
			shopID = u.ShopID.Hex()
		}
		if u.RegionID != nil {
			regionID = u.RegionID.Hex()
		}
		if u.BranchID != nil {
			branchID = u.BranchID.Hex()
		}
		if u.DepartmentID != nil {
			departmentID = u.DepartmentID.Hex()
		}
		users[i] = UserResponse{
			ID:           u.ID.Hex(),
			Username:     u.Username,
			Email:        u.Email,
			Role:         u.Role,
			ShopID:       shopID,
			RegionID:     regionID,
			BranchID:     branchID,
			DepartmentID: departmentID,
		}
	}

	shops := make([]ShopResponse, len(output.Shops))
	for i, s := range output.Shops {
		shops[i] = ShopResponse{
			ID:   s.ID.Hex(),
			Name: s.Name,
		}
	}

	regions := make([]RegionResponse, len(output.Regions))
	for i, r := range output.Regions {
		regions[i] = RegionResponse{
			ID:   r.ID.Hex(),
			Name: r.Name,
		}
	}

	branches := make([]BranchResponse, len(output.Branches))
	for i, b := range output.Branches {
		branches[i] = BranchResponse{
			ID:   b.ID.Hex(),
			Name: b.Name,
		}
	}

	departments := make([]DepartmentResponse, len(output.Departments))
	for i, d := range output.Departments {
		departments[i] = DepartmentResponse{
			ID:   d.ID.Hex(),
			Name: d.Name,
		}
	}

	return GetResponse{
		Pagin:       output.Pagin.ToResponse(),
		Users:       users,
		Shops:       shops,
		Regions:     regions,
		Branches:    branches,
		Departments: departments,
	}
}

func (h handler) newGetByIDResponse(output user.GetOneOutPut) GetByIDResponse {
	var shopID, regionID, branchID, departmentID string
	if output.User.ShopID != nil {
		shopID = output.User.ShopID.Hex()
	}
	if output.User.RegionID != nil {
		regionID = output.User.RegionID.Hex()
	}
	if output.User.BranchID != nil {
		branchID = output.User.BranchID.Hex()
	}
	if output.User.DepartmentID != nil {
		departmentID = output.User.DepartmentID.Hex()
	}

	var shop *ShopResponse
	if output.Shop != nil {
		shop = &ShopResponse{
			ID:   output.Shop.ID.Hex(),
			Name: output.Shop.Name,
		}
	}

	var region *RegionResponse
	if output.Region != nil {
		region = &RegionResponse{
			ID:   output.Region.ID.Hex(),
			Name: output.Region.Name,
		}
	}

	var branch *BranchResponse
	if output.Branch != nil {
		branch = &BranchResponse{
			ID:   output.Branch.ID.Hex(),
			Name: output.Branch.Name,
		}
	}

	var department *DepartmentResponse
	if output.Department != nil {
		department = &DepartmentResponse{
			ID:   output.Department.ID.Hex(),
			Name: output.Department.Name,
		}
	}

	return GetByIDResponse{
		User: UserResponse{
			ID:           output.User.ID.Hex(),
			Username:     output.User.Username,
			Email:        output.User.Email,
			Role:         output.User.Role,
			ShopID:       shopID,
			RegionID:     regionID,
			BranchID:     branchID,
			DepartmentID: departmentID,
		},
		Shop:       shop,
		Region:     region,
		Branch:     branch,
		Department: department,
	}
}

func (h handler) newDeleteResponse(res string) DeleteResponse {
	return DeleteResponse{
		Message: res,
	}
}

func (h handler) newCreateResponse(user models.User) SignUpResponse {
	return SignUpResponse{
		ID:        user.ID.Hex(),
		Username:  user.Username,
		Email:     user.Email,
		Role:      user.Role,
		CreatedAt: response.DateTime(user.CreatedAt),
	}
}
