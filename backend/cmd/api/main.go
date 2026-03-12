package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	containerPkg "github.com/base-go/backend/container"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found")
	}

	// setup server
	container, err := containerPkg.New()
	if err != nil {
		log.Fatal(err)
	}

	err = container.Invoke(Start)
	if err != nil {
		log.Fatal(err)
	}

	// add quit signal
	quit := make(chan os.Signal, 1)
	container.Provide(func() chan os.Signal {
		return quit
	})

	signal.Notify(quit, os.Interrupt, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)

	err = container.Invoke(Shutdown)
	if err != nil {
		log.Fatal(err)
	}
}
