import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch } from "./api";

const fetchMock = vi.fn();

function respond(status: number, body: unknown, json = true) {
  fetchMock.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: json ? async () => body : async () => { throw new SyntaxError("not json"); },
  });
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  Object.defineProperty(window, "location", {
    value: { href: "http://localhost/dashboard" },
    writable: true,
    configurable: true,
  });
  localStorage.setItem("token", "abc");
  localStorage.setItem("user", "{}");
});

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("apiFetch", () => {
  it("sends the bearer token when given one, and none otherwise", async () => {
    respond(200, { ok: true });
    respond(200, { ok: true });

    await apiFetch("/tracks", {}, "abc");
    await apiFetch("/tracks", {}, null);

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer abc");
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBeUndefined();
  });

  it("returns the parsed body on success", async () => {
    respond(200, { hello: "world" });
    expect(await apiFetch("/x")).toEqual({ hello: "world" });
  });

  it("surfaces the server's message in either error shape", async () => {
    respond(400, { message: "flat message" });
    await expect(apiFetch("/x")).rejects.toThrow("flat message");

    respond(409, { success: false, error: { message: "nested message", code: "X" } });
    await expect(apiFetch("/x")).rejects.toThrow("nested message");
  });

  it("copes with a non-JSON error response", async () => {
    respond(502, null, false);
    await expect(apiFetch("/x")).rejects.toThrow("Something went wrong");
  });

  it("ends the session when an authenticated request returns 401", async () => {
    respond(401, { message: "Not authorized, invalid token" });

    await expect(apiFetch("/tracks", {}, "abc")).rejects.toThrow("Session expired");
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(window.location.href).toBe("/login");
  });

  it("treats a 401 without a token (a wrong password) as a normal error", async () => {
    respond(401, { message: "Invalid credentials" });

    await expect(apiFetch("/auth/login", { method: "POST" })).rejects.toThrow("Invalid credentials");
    expect(localStorage.getItem("token")).toBe("abc");
    expect(window.location.href).toBe("http://localhost/dashboard");
  });
});