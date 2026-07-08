import "dotenv/config";
import Pyroscope from "@pyroscope/nodejs";

const {
  PYROSCOPE_SERVER_ADDRESS,
  PYROSCOPE_BASIC_AUTH_USER,
  PYROSCOPE_API_KEY,
  PYROSCOPE_APPLICATION_NAME,
} = process.env;

const pyroscopeEnabled = Boolean(
  PYROSCOPE_SERVER_ADDRESS && PYROSCOPE_BASIC_AUTH_USER && PYROSCOPE_API_KEY
);

if (pyroscopeEnabled) {
  Pyroscope.init({
    serverAddress: PYROSCOPE_SERVER_ADDRESS,
    appName: PYROSCOPE_APPLICATION_NAME || "momentum-api",
    basicAuthUser: PYROSCOPE_BASIC_AUTH_USER,
    basicAuthPassword: PYROSCOPE_API_KEY,
  });
  Pyroscope.start();
  console.log("Pyroscope: profiling actif");
} else {
  console.log("Pyroscope: désactivé (variables d'environnement absentes)");
}
