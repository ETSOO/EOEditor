import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import json from '@rollup/plugin-json';
import pkg from "./package.json" with { type: "json" };

const external = [...Object.keys(pkg.dependencies || {})];

const configMjs = {
  input: "src/index.ts",
  output: [{
    dir: "lib/mjs",
    preserveModules: true,
    preserveModulesRoot: "src",
    format: "es",
    exports: "named"
  }],
  external: external,
  plugins: [
    typescript({declaration: true, declarationDir: "lib/mjs"}),
    postcss({
      extensions: [".css"]
    }),
    json()
  ]
};

const configCjs = {
  input: "src/index.ts",
  output: [{
    dir: "lib/cjs",
    preserveModules: true,
    preserveModulesRoot: "src",
    format: "cjs",
    exports: "named"
  }],
  external: external,
  plugins: [
    typescript({declaration: true, declarationDir: "lib/cjs"}),
    postcss({
      extensions: [".css"]
    }),
    json()
  ]
};

export default [configMjs, configCjs];