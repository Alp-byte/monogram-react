package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {

	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowCredentials: true,
	}))

	e.POST("/svgToEps", func(c echo.Context) error {
		return c.JSON(200, struct {
			Url string `json:"url"`
		}{
			"http://localhost/ci-svgmaster/uploads/apple9.eps",
		})
	})




	e.Start(":5000")
}
