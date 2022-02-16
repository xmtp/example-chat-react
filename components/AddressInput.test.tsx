import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import AddressInput from "./AddressInput";
import assert from "assert";

describe("AddressInput", () => {
  it("renders no initial value", () => {
    const { container } = render(<AddressInput />);
    expect(container.querySelector("input")).toHaveAttribute("value", "");
  });

  it("renders initial value", () => {
    const { container } = render(<AddressInput initialValue={"0xfoo"} />);
    expect(container.querySelector("input")).toHaveAttribute("value", "0xfoo");
  });

  it("renders resolved initial value", async () => {
    const { container } = render(
      <AddressInput
        initialValue={"foo.eth"}
        resolveName={async (name: string) =>
          name === "foo.eth" ? "0xfoo" : undefined
        }
      />
    );
    const input = container.querySelector("input");
    await waitFor(() => expect(input).toHaveAttribute("value", "0xfoo"));
  });

  it("renders resolved changed value", async () => {
    const { container } = render(
      <AddressInput
        initialValue="0xbar"
        resolveName={async (name: string) =>
          name === "foo.eth" ? "0xfoo" : undefined
        }
      />
    );
    const input = container.querySelector("input");
    assert.ok(input);
    expect(input).toHaveAttribute("value", "0xbar");
    fireEvent.change(input, { target: { value: "foo.eth" } });
    await waitFor(() => expect(input).toHaveAttribute("value", "0xfoo"));
  });
});
