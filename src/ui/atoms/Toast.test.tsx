import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast } from "./Toast";

describe("Toast", () => {
  test("renders nothing when message is null", () => {
    render(<Toast message={null} onDismiss={() => {}} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("renders the message when provided", () => {
    render(<Toast message="Something failed" onDismiss={() => {}} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Something failed");
  });

  test("calls onDismiss when the dismiss control is clicked", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(<Toast message="Something failed" onDismiss={onDismiss} />);

    await user.click(screen.getByRole("button", { name: /dismiss/i }));

    expect(onDismiss).toHaveBeenCalled();
  });
});
