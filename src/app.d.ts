// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
      user: { 
        id: string; 
        first_name: string; 
        middle_name: string; 
        last_name: string; 
        role: "admin" | "accountant" 
      } | null;
    }
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
