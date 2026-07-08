import http from "k6/http";
import { check, sleep } from "k6";

const API_BASE_URL = __ENV.API_BASE_URL;
const SUPABASE_URL = __ENV.SUPABASE_URL;
const SUPABASE_ANON_KEY = __ENV.SUPABASE_ANON_KEY;
const TEST_EMAIL = __ENV.TEST_EMAIL;
const TEST_PASSWORD = __ENV.TEST_PASSWORD;

const SLEEP_SECONDS = Number(__ENV.SLEEP_SECONDS) || 2;

export const options = {
  vus: Number(__ENV.VUS) || 1,
  duration: __ENV.DURATION || "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"],
  },
};

export function setup() {
  const authRes = http.post(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    { headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY } }
  );

  check(authRes, { "auth: status 200": (r) => r.status === 200 });

  const token = authRes.json("access_token");
  if (!token) {
    throw new Error("Impossible de récupérer un access_token Supabase (vérifier TEST_EMAIL/TEST_PASSWORD)");
  }

  return { token };
}

export default function (data) {
  const res = http.get(`${API_BASE_URL}/api/dashboard`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });

  check(res, { "dashboard: status 200": (r) => r.status === 200 });

  sleep(SLEEP_SECONDS);
}
