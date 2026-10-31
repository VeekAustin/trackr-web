import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const replace = vi.fn();
let authState: { token: string | null; loading: boolean } = { token: null, loading: false };

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
vi.mock("@/context/AuthContext", () => ({ useAuth: () => authState }));

import Home from "./page";

beforeEach(() => {
  replace.mockClear();
  authState = { token: null, loading: false };
});

afterEach(cleanup);

describe("Landing page", () => {
  it("offers sign up and log in to visitors without redirecting", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1 })).not.toBeNull();
    for (const link of screen.getAllByRole("link", { name: /^log in$/i })) {
      expect(link.getAttribute("href")).toBe("/login");
    }
    for (const link of screen.getAllByRole("link", { name: /^(sign up|create an account)$/i })) {
      expect(link.getAttribute("href")).toBe("/signup");
    }
    expect(replace).not.toHaveBeenCalled();
  });

  it("shows the example heatmap and every template", () => {
    render(<Home />);

    expect(screen.getByRole("img", { name: /last 90 days/i })).not.toBeNull();
    for (const name of ["Developer", "Teacher", "Trader", "Student", "Fitness"]) {
      expect(screen.getByRole("heading", { name })).not.toBeNull();
    }
  });

  it("sends a logged-in user to the dashboard", () => {
    authState = { token: "abc", loading: false };
    render(<Home />);
    expect(replace).toHaveBeenCalledWith("/dashboard");
  });

  it("waits for the session check before redirecting", () => {
    authState = { token: "abc", loading: true };
    render(<Home />);
    expect(replace).not.toHaveBeenCalled();
  });
});