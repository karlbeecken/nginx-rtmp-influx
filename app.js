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
          const influx = new Influx.InfluxDB({
            host: "localhost",
            database: "rtmp",
            schema: [
              {
                measurement: app.name,
                fields: {
                  bitrate: Influx.FieldType.INTEGER,
                },
                tags: ["host", "name"],
              },
            ],
          });

          influx.writePoints([
            {
              measurement: app.name,
              tags: { host: os.hostname(), name: stream.name },
              fields: { bitrate: stream.bw_in },
            },
          ]);

          console.log(app.name + "_" + stream.name + ":" + stream.bw_in);
        });
      } else {
        let stream = app.live.stream;

        const influx = new Influx.InfluxDB({
          host: "localhost",
          database: "rtmp",
          schema: [
            {
              measurement: app.name,
              fields: {
                bitrate: Influx.FieldType.INTEGER,
              },
              tags: ["host", "name"],
            },
          ],
        });

        influx.writePoints([
          {
            measurement: app.name,
            tags: { host: os.hostname(), name: stream.name },
            fields: { bitrate: stream.bw_in },
          },
        ]);

        console.log(app.name + "_" + stream.name + ":" + stream.bw_in);
      }
    }
  });
});
