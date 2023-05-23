import type { OAuthUserConfig, OAuthConfig } from "next-auth/providers/oauth";
export interface InfojobsCandidate extends Record<string, any> {
    id: number;
    email: string;
    photo: string;
    name: string;
}
interface AdditionalConfig {
    infojobs_scopes: string;
    redirect_uri: string;
}
export default function InfojobsProvider<P extends InfojobsCandidate>(options: OAuthUserConfig<P> & AdditionalConfig): OAuthConfig<P>;
export {};
//# sourceMappingURL=index.d.ts.map