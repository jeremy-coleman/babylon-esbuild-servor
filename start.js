var cp = require("child_process")
var path = require("path")
var esbuild = require("esbuild")
var servor = require("servor")
var diff = require("ansi-diff-stream")()



const CLI_ARGS = process.argv.slice(2)

var USE_ELECTRON = Boolean(CLI_ARGS.includes("--use-electron"))

//set a default
//CLI_ARGS[0] == null && dosomething()

diff.on("data", function (data) {
  process.stdout.write(data)
})

process.stdout.on("resize", function () {
  diff.reset()
})

const logtime = (e) => void diff.write(e || `Success! [${new Date().toLocaleTimeString()}]`)

esbuild
  .build({
    entryPoints: ["src/code/platformer/platformer.ts"],
    outfile: "./src/www/platformer.js",
    format: "esm",
    bundle: true,
    minify: true,
    loader: {
      ".wgsl": "text",
    },
    platform: "browser",
    watch: {
      onRebuild(error) {
        logtime(error)
      },
    },
  })
  .catch((e) => {
    console.error(e)
    process.exit(0)
  })
  .finally(() => {
    logtime()
  })

var PORT = 5000

servor({
  root: "src/www",
  reload: true,
  port: PORT,
})
  .then(() => {
    console.log(`> Running on http://localhost:${PORT}`)

    if (USE_ELECTRON) {
      //"main": "src/desktop/main.js",
      const bin = "electron"
      const args = ["."]
      const cmd = process.platform === "win32" ? `${bin}.cmd` : bin
      const child = cp.spawn(path.resolve(__dirname, "node_modules", ".bin", cmd), args, {
        cwd: path.resolve(__dirname),
        stdio: "inherit",
      })
      child.on("data", (data) => console.log(data))
      child.on("exit", (code) => {
        process.exit(0)
      })
    }
  })
  .catch((e) => console.log(e))
