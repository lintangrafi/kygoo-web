package main

import (
	"log"
	"os"

	"github.com/base-go/backend/pkg/server"
)

func Start(
	svr server.Server,
) {
	RunMigration()

	log.Println("Starting server...")
	if err := svr.Start(); err != nil {
		log.Fatal(err)
	}

	if environtment == "production" {
		// for the security purpose, we need to remove file configuration after server start
		// This can be used in case the container where the backend is located is hacked,
		// information related to DB configuration, etc. cannot be accessed.
		log.Println("Deleting configuration after service running...")
		if err := os.Remove("./config/config.production.yaml"); err != nil {
			log.Fatal(err)
		}
	}
}

func Shutdown(
	quit chan os.Signal,
	svr server.Server,
) {
	q := <-quit
	log.Println("got signal:", q)

	log.Println("Shutting down server...")
	if err := svr.Stop(); err != nil {
		log.Fatal(err)
	}

	log.Println("service gracefully shutdown")
}
