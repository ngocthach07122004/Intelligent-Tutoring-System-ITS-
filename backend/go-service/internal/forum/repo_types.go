package forum

import "init-src/pkg/paginator"

type ListPostsInput struct {
	SortBy    string
	Filter    string
	Tag       string
	Paginator paginator.PaginatorQuery
}
