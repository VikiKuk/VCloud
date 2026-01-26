function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function ensureCsrf() {
  // ставит csrftoken cookie
  await fetch("/api/auth/csrf", { credentials: "include" });
}

export async function apiFetch(url, options = {}) {
  const csrf = getCookie("csrftoken");
  const headers = options.headers ? { ...options.headers } : {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (csrf) headers["X-CSRFToken"] = csrf;

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include"
  });

  if (res.status === 204) return null;

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = typeof data === "string" ? data : (data.error || JSON.stringify(data));
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}