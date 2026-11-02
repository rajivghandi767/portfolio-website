import { describe, test, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { LazySection } from "./LazySection";

describe("LazySection Component", () => {
  test("mounts children immediately when lazysection:reveal event is dispatched", () => {
    render(
      <LazySection id="wallet">
        <div id="wallet">Wallet Content Loaded</div>
      </LazySection>,
    );

    expect(document.getElementById("wallet")).not.toBeNull();
    expect(screen.queryByText("Wallet Content Loaded")).toBeNull();

    act(() => {
      window.dispatchEvent(
        new CustomEvent("lazysection:reveal", { detail: { id: "wallet" } }),
      );
    });

    expect(screen.getByText("Wallet Content Loaded")).toBeDefined();
  });
});
