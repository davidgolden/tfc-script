module.exports = function (api) {
    api.cache(true);

    const presets = [
        ["@babel/preset-env", {
            "modules": process.env.NODE_ENV === "test" ? "auto" : false,
            "useBuiltIns": "entry",
            "corejs": 3,
            "exclude": ["transform-typeof-symbol"],  // we don't need the typeof helper (and it doesn't get transpiled into ES5, so it screws up the bundle)
        }],
        ["@babel/preset-react", {
            development: process.env.BABEL_ENV === 'development',
            runtime: "automatic",
        }],
    ];
    const plugins = [
        // ["@babel/plugin-proposal-decorators", {legacy: true}],
        // "@babel/plugin-proposal-export-namespace-from",
        // "@babel/plugin-syntax-import-meta",
        // "@babel/plugin-transform-runtime",
        // ["@babel/plugin-proposal-class-properties", {loose: false}],
        // "@babel/plugin-proposal-optional-chaining",
        // "@babel/plugin-syntax-dynamic-import",
        // ["const-enum", {transform: "constObject"}],
    ];

    return {
        presets,
        plugins,
    };
};
