import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts'
import pkg from "./package.json" with { type: "json" };

const config = {
  input: "src/index.ts",
  output: [{
    dir: "lib/mjs",
    preserveModules: true,
    preserveModulesRoot: "src",
    format: "es",
    exports: "named"
  },{
    dir: "lib/cjs",
    preserveModules: true,
    preserveModulesRoot: "src",
    format: "cjs",
    exports: "named"
  }],
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [
    typescript(),
    postcss({
      extensions: [".css"]
    }),
    json(),
    dts()
  ]
};
export default config;