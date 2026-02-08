package main

import (
	"log"

	"github.com/proxima-labs/wedding-invitation-back-end/src/app"
)

func main() {
	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
