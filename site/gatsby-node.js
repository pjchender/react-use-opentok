exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /@opentok\/client|console-feed/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
