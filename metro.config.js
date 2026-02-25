const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// FIX: Zustand v4 ESM files contain `import.meta.env` which crashes web bundles.
// We intercept only zustand imports and redirect them to CJS files.
// This avoids globally changing unstable_conditionNames (which would break
// Firebase by routing it to its React-Native-only bundle that lacks signInWithPopup).
const zustandRoot = path.resolve(__dirname, "node_modules/zustand");

config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Redirect zustand and its sub-paths to their CJS builds
    if (moduleName === "zustand" || moduleName.startsWith("zustand/")) {
      const subPath = moduleName === "zustand" ? "index" : moduleName.slice("zustand/".length);
      const cjsFile = path.join(zustandRoot, `${subPath}.js`);
      return {
        filePath: cjsFile,
        type: "sourceFile",
      };
    }
    // Default resolution for everything else (Firebase, etc.)
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
