package config

import (
	"log"
	"os"
	"sync"

	"github.com/goccy/go-yaml"
)

type Config struct {
	App      App      `yaml:"app"`
	Auth     Auth     `yaml:"auth"`
	Database Database `yaml:"database"`
	Cache    Cache    `yaml:"cache"`
}

var (
	cfg  *Config
	once sync.Once
)

func LoadConfig(path string) {
	once.Do(func() {
		cfg = &Config{}

		data, err := os.ReadFile(path)
		if err != nil {
			log.Fatal(err)
		}

		// Expand ${VAR} placeholders from environment variables before parsing YAML.
		expanded := os.ExpandEnv(string(data))

		if err := yaml.Unmarshal([]byte(expanded), cfg); err != nil {
			log.Fatalf("error unmarshalling config: %v", err)
		}
	})
}

func GetConfig() *Config {
	return cfg
}
