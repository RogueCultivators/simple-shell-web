amd64:
	go build -ldflags="-s -w" -o bin/webshell .
arm64:
	GOOS=linux GOARCH=arm64 CC=aarch64-linux-gnu-gcc go build -ldflags="-s -w"  -o bin/webshell_arm64 .