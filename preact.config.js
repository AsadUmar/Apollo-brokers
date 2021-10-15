export default (config) => {
    config.module.rules.push({
            test:  /src\.less$/,
            loader: [
                "style-loader",
                "css-loader",
                "less-loader",
            ],
        },
    );
};
