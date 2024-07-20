import morgan from "morgan";

morgan.token("time", () =>
  new Date().toLocaleTimeString("en-IN", { hour12: false })
);

morgan.token("splitter", (_req) => {
  return "\n\x1b[36m--------------------------------------------\x1b[0m";
});
morgan.token("statusColor", (_req, res, _args) => {
  // get the status code if response written
  var status = res.statusCode;
  // get status color
  var color =
    status >= 500
      ? 31 // red
      : status >= 400
      ? 33 // yellow
      : status >= 300
      ? 36 // cyan
      : status >= 200
      ? 32 // green
      : 0; // no color

  return "\x1b[" + color + "m" + status + "\x1b[0m";
});

export default morgan(
  `\x1b[35m:time \x1b[33m:method\x1b[0m \x1b[36m:url\x1b[0m :statusColor :response-time ms - length|:res[content-length] :remote-addr :splitter`
);
