import globals from "globals";
import pluginJs from "@eslint/js";

// https://eslint.org/docs/latest/use/command-line-interface
export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];