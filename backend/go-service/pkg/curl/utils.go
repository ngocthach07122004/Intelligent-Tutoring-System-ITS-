package curl

import (
	"fmt"
	"net/url"
	"strings"
)

func GetInternalUrl(microserviceUrl, endpoint string) string {
	microserviceUrl = strings.TrimSpace(microserviceUrl)
	endpoint = strings.TrimSpace(endpoint)

	baseURL, err := url.Parse("http://" + microserviceUrl)
	if err != nil {
		fmt.Println("err: ", err)
		return ""
	}
	endpointURL, err := url.Parse(endpoint)
	if err != nil {
		return ""
	}

	finalURL := baseURL.ResolveReference(endpointURL)
	return finalURL.String()
}
