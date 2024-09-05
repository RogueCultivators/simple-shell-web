const socket = new WebSocket(`ws://${window.location.host}/command`);
socket.onmessage = (event) => {
    if (event.data === "err") {
        socket.close()
        alert("退出登录，即将刷新页面")
        window.location.reload();
    } else {
        term.write(event.data);

    }
};
var term = new window.Terminal({
    cursorBlink: true,
    rendererType: "canvas",
    fontFamily: '"Courier New", Courier, monospace', // 设置字体
    fontSize: 14, // 设置字体大小
    allowProposedApi: true,
    theme: {
        background: "#0c4a6e",
        selectionBackground: "#737373",
        // 定义 ANSI 颜色
        black: "#000000",
        red: "#CD0000",
        green: "#00CD00",
        yellow: "#CDCD00",
        blue: "#0000CD",
        magenta: "#CD00CD",
        cyan: "#00CDCD",
        white: "#E5E5E5",
        brightBlack: "#7F7F7F",
        brightRed: "#FF0000",
        brightGreen: "#00FF00",
        brightYellow: "#FFFF00",
        brightBlue: "#0000FF",
        brightMagenta: "#FF00FF",
        brightCyan: "#00FFFF",
        brightWhite: "#FFFFFF",
    },
});

// 创建 ClipboardAddon 实例
const clipboardAddon = new window.ClipboardAddon.ClipboardAddon();
console.log(clipboardAddon);
term.loadAddon(clipboardAddon);
const fitAddon = new window.FitAddon.FitAddon()
term.loadAddon(fitAddon);
const unicode11Addon = new window.Unicode11Addon.Unicode11Addon();
term.loadAddon(unicode11Addon);
term.unicode.activeVersion = '11';
term.open(document.getElementById("terminal"));
fitAddon.fit();
document.getElementsByClassName("xterm-rows")[0].focus ()
console.log(
document.getElementsByClassName("xterm-rows")[0].getel)
var login = false;
function init() {
    if (term._initialized) {
        return;
    }

    term._initialized = true;

    // term.prompt = () => {
    //   runCommand("");
    // };

    term.onData((data) => {
        runCommand(data);
    });

    // 监听键盘事件
}

function runCommand(command) {
    socket.send(command);
}

init();
