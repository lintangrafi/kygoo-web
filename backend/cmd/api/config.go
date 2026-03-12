package main

import (
	"flag"

	"github.com/base-go/backend/pkg/config"
)

var environtment string

func init() {
	env := flag.String("env", "development", "Environment (development/production)")
	flag.Parse()

	environtment = *env

	switch *env {
	case "development":
		config.LoadConfig("./config/config.development.yaml")
	case "staging":
		config.LoadConfig("./config/config.staging.yaml")
	case "production":
		config.LoadConfig("./config/config.production.yaml")
	}
}
