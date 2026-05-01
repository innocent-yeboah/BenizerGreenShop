/** Packages ship JS without types in some setups; keeps `tsc` / IDE happy with skipLibCheck. */
declare module "next-safe-action";
declare module "next-safe-action/hooks";

declare module "resend" {
  export class Resend {
    constructor(apiKey: string);
    emails: {
      send(
        args: Record<string, unknown>,
      ): Promise<{ data?: { id?: string }; error?: { message?: string } }>;
    };
  }
}
