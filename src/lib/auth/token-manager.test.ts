import { describe, expect, it } from "vitest";
import { tokenManager } from "@/lib/auth/token-manager";
describe("token manager", () => {
  it("keeps tokens in memory and clears them", () => {
    tokenManager.set("token");
    expect(tokenManager.get()).toBe("token");
    tokenManager.clear();
    expect(tokenManager.get()).toBeNull();
  });
});
