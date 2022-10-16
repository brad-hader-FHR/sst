import esbuild from "esbuild";
import fs from "fs/promises";

const pkg = await fs.readFile("package.json").then(JSON.parse);

const result = await esbuild.build({
  entryPoints: ["src/sst.ts"],
  bundle: true,
  outdir: "dist",
  metafile: true,
  external: [
    ...Object.keys(pkg.dependencies),
    "pg",
    "mysql2",
    "better-sqlite3",
    "../resources",
  ],
  jsx: "automatic",
  platform: "node",
  loader: {
    ".js": "tsx",
    ".ts": "tsx",
  },
  target: "esnext",
  format: "esm",
  watch: {
    onRebuild: console.log,
  },
  banner: {
    js: [
      `import { createRequire as topLevelCreateRequire } from 'module';`,
      `global.require = topLevelCreateRequire(import.meta.url);`,
    ].join("\n"),
  },
});