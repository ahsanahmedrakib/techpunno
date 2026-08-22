process.env.NODE_OPTIONS =
  (process.env.NODE_OPTIONS || "") + " --require " + require("path").resolve(__dirname, "dns-setup.cjs");
