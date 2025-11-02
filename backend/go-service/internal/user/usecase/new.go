package usecase

import (
	"init-src/internal/branch"
	"init-src/internal/department"
	"init-src/internal/region"
	"init-src/internal/shop"
	"init-src/internal/user"
	"init-src/pkg/encrypter"
	"init-src/pkg/jwt"
	"init-src/pkg/log"
)

type implUsecase struct {
	l          log.Logger
	repo       user.Repository
	shopUC     shop.Usecase
	deptUC     department.Usecase
	branchUC   branch.Usecase
	regionUC   region.Usecase
	jwtManager jwt.Manager
	encrypter  encrypter.Encrypter
}

func New(l log.Logger, repo user.Repository, manager jwt.Manager, shopUC shop.Usecase, regionUC region.Usecase, branchUC branch.Usecase, deptUC department.Usecase, encrypter encrypter.Encrypter) user.Usecase {
	return &implUsecase{
		l:          l,
		repo:       repo,
		jwtManager: manager,
		shopUC:     shopUC,
		deptUC:     deptUC,
		branchUC:   branchUC,
		regionUC:   regionUC,
		encrypter:  encrypter,
	}
}
