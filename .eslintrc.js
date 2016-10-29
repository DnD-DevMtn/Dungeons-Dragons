module.exports = {
    "extends": "airbnb",
    "plugins": [
        "import"
    ],
    "rules": {
      "indent": ["error", 4],
      "no-use-before-define": ["error", { "functions": false, "classes": false }],
      "max-len": ["error", {code:125}],
      "arrow-body-style": ["error", "always"],
      "quotes": ["error", "double", { "allowTemplateLiterals": true }]
    },
    "env": {
      "es6": true
    }
};
