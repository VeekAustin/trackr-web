import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./AuthContext";

function Probe() {
  const { user, token, loading, logout } = useAuth();
  return (
    <div>
      <p data-testid="state">{loading ? "loading" : user ? `user:${user.name}` : "anonymous"}</p>
      <p data-testid="token">{token ?? "none"}</p>
      <button onClick={logout}>log out</button>
    </div>
  );
}

function renderWithProviders(client = new QueryClient()) {
  render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <Probe />
      </AuthProvider>
    </QueryClientProvider>,
  );
  return client;
}

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("AuthProvider", () => {
  it("starts anonymous when nothing is stored", async () => {
    renderWithProviders();
    await waitFor(() => expect(screen.getByTestId("state").textContent).toBe("anonymous"));
  });

  it("restores a saved session", async () => {
    localStorage.setItem("token", "abc");
    localStorage.setItem("user", JSON.stringify({ id: "1", name: "Veek", email: "v@example.com" }));

    renderWithProviders();
    await waitFor(() => expect(screen.getByTestId("state").textContent).toBe("user:Veek"));
    expect(screen.getByTestId("token").textContent).toBe("abc");
  });

  it("treats a damaged saved session as logged out instead of crashing", async () => {
    localStorage.setItem("token", "abc");
    localStorage.setItem("user", "{not valid json");

    renderWithProviders();
    await waitFor(() => expect(screen.getByTestId("state").textContent).toBe("anonymous"));
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("logout clears storage and the query cache", async () => {
    localStorage.setItem("token", "abc");
    localStorage.setItem("user", JSON.stringify({ id: "1", name: "Veek", email: "v@example.com" }));
    const client = new QueryClient();
    client.setQueryData(["tracks", "1"], [{ _id: "t" }]);

    renderWithProviders(client);
    await waitFor(() => expect(screen.getByTestId("state").textContent).toBe("user:Veek"));

    fireEvent.click(screen.getByRole("button", { name: "log out" }));

    await waitFor(() => expect(screen.getByTestId("state").textContent).toBe("anonymous"));
    expect(localStorage.getItem("token")).toBeNull();
    expect(client.getQueryData(["tracks", "1"])).toBeUndefined();
  });
});