import * as ecoBenchmarkService from "../services/eco-benchmark.service.js";

export function getEcoBenchmark(req, res, next) {
  try {
    const result = ecoBenchmarkService.runBenchmark();
    res.set("Cache-Control", "no-store");
    res.json(result);
  } catch (err) {
    next(err);
  }
}
