const Influx = require("influx");
const os = require("os");
const axios = require("axios");
const parser = require("xml2json");

axios.get("http://onfire.live/stat").then((res) => {
  let json = parser.toJson(res.data, { object: true });

  json.rtmp.server.application.forEach((app) => {
    if (app.live.stream) {
      if (Array.isArray(app.live.stream)) {
        app.live.stream.forEach((stream) => {
          console.log(app.name + "_" + stream.name);
          console.log(stream);
        });
      } else {
        console.log(app.name + "_" + app.live.stream.name);
        console.log(app.live.stream);
      }
    }
  });
  // res.data.data.forEach((val) => {
  //   const influx = new Influx.InfluxDB({
  //     host: "localhost",
  //     database: "rtmp",
  //     schema: [
  //       {
  //         measurement: val.name.replace(/ /gi, "_"),
  //         fields: {
  //           name: Influx.FieldType.STRING,
  //           status: Influx.FieldType.INTEGER,
  //           id: Influx.FieldType.INTEGER,
  //         },
  //         tags: ["host"],
  //       },
  //     ],
  //   });

  //   influx
  //     .writePoints([
  //       {
  //         measurement: val.name.replace(/ /gi, "_"),
  //         tags: { host: os.hostname() },
  //         fields: { name: val.name, status: val.status, id: val.id },
  //       },
  //     ])
  // });
});
