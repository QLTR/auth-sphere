module.exports = {
  "env": {
    "node": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:node/recommended"
  ],
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 10,
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "max-len": [
      "error",
      { "code": 80 }
    ],
    "node/exports-style": [
      "error",
      "module.exports"
    ],
    "node/file-extension-in-import": [
      "error",
      "always"
    ],
    "node/prefer-global/buffer": [
      "error",
      "always"
    ],
    "node/prefer-global/console": [
      "error",
      "always"
    ],
    "node/prefer-global/process": [
      "error",
      "always"
    ],
    "node/prefer-global/url-search-params": [
      "error",
      "always"
    ],
    "node/prefer-global/url": [
      "error",
      "always"
    ],
    "node/prefer-promises/dns": "error",
    "node/prefer-promises/fs": "error"
  }
};
