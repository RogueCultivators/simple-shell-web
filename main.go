package main

import (
	"embed"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"os"
	"os/exec"

	"github.com/creack/pty"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

//go:embed index.html js css
var content embed.FS

func main() {

	http.HandleFunc("/command", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		c := exec.Command("login") // 系统默认shell交互程序
		f, err := pty.Start(c)     // pty用于调用系统自带的虚拟终端
		if err != nil {
			panic(err)
		}
		defer conn.Close()
		go func() { // 处理来自虚拟终端的消息
			for {
				buf := make([]byte, 10240)
				_, err := f.Read(buf)
				if err != nil {
					_ = conn.WriteMessage(1, []byte("err"))
					break
				}

				fmt.Println(string(buf))
				conn.WriteMessage(1, buf)
			}
		}()
		for {
			_, msg, err := conn.ReadMessage()
			if err != nil {
				conn.Close()
				break
			}
			fmt.Println(string(msg))
			f.Write(msg)
		}

	})

	web := http.FileServer(http.FS(content))
	http.Handle("/", http.StripPrefix("/", web)) // 设置静态文件服务
	fs := http.FileServer(http.Dir("/"))
	http.Handle("/files/", http.StripPrefix("/files", fs))
	port := os.Getenv("PORT")
	if port == "" {
		port = "22333"
	}
	fmt.Printf("Listening on http://0.0.0.0:%s You can set env 'PORT'\n", port)
	err := http.ListenAndServe(fmt.Sprintf("0.0.0.0:%s", port), nil)
	if err != nil {
		panic(err)
	} // 启动服务器，访问 http://本机(服务器)IP地址:22333/ 进行测试

}
