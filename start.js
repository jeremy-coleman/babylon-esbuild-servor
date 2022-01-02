var esbuild = require("esbuild")
var servor = require("servor")
var diff = require("ansi-diff-stream")()

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
  })
  .catch((e) => console.log(e))
