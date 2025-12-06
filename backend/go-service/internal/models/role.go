package models

const (
	RoleAdmin         = "admin"
	RoleManager       = "manager"
	RoleRegionManager = "region_manager"
	RoleBranchManager = "branch_manager"
	RoleHeadOfDept    = "head_of_department"
	RoleEmployee      = "employee"
)

var RoleRank = map[string]int{
	RoleAdmin:         6,
	RoleManager:       5,
	RoleRegionManager: 4,
	RoleBranchManager: 3,
	RoleHeadOfDept:    2,
	RoleEmployee:      1,
}