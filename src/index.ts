// import type provider from next-auth package
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

export const AUTHORIZATION_URL = "https://www.infojobs.net/api/oauth/user-authorize/index.xhtml";
export const TOKEN_URL = "https://www.infojobs.net/oauth/authorize";
export const USER_INFO_URL = "https://api.infojobs.net/api/6/candidate";
export default function InfojobsProvider<P extends InfojobsCandidate>(options: OAuthUserConfig<P> & AdditionalConfig): OAuthConfig<P> {
    return {
        id: "infojobs",
        name: "Infojobs",
        type: "oauth",
        version: "2.0",
        checks: ["none"],
        authorization: {
            url: AUTHORIZATION_URL,
            params: {
                scope: options.infojobs_scopes,
                redirect_uri: options.redirect_uri,
                response_type: "code"
            }
        },
        token: {
            url: TOKEN_URL,
            async request({ params }) {
                const tokenUrl = new URL(TOKEN_URL ?? "");
                tokenUrl.searchParams.append("grant_type", "authorization_code");
                tokenUrl.searchParams.append("code", params.code ?? "");
                tokenUrl.searchParams.append("redirect_uri", `${options.redirect_uri}` ?? "");
                tokenUrl.searchParams.append("client_id", options.clientId ?? "");
                tokenUrl.searchParams.append("client_secret", options.clientSecret ?? "");
                const response = await fetch(tokenUrl.toString(), {
                    method: "POST"
                });
                const tokens = await response.json();
                return {
                    tokens
                };
            }
        },
        userinfo: {
            async request({ tokens }) {
                const basicToken = `Basic ${Buffer.from(`${options.clientId}:${options.clientSecret}`).toString("base64")}`;
                const bearerToken = `Bearer ${tokens.access_token}`;
                const response = await fetch(USER_INFO_URL, {
                    headers: {
                        Authorization: `${basicToken},${bearerToken}`
                    }
                });
                const profile = await response.json();
                return {
                    id: profile.id,
                    email: profile.email,
                    image: profile.photo,
                    name: profile.name,
                    sub: profile.id
                };
            }
        },
        profile(profile) {
            return {
                id: profile.id.toString(),
                name: profile.name,
                email: profile.email,
                image: profile.photo
            };
        },
        style: {
            bg: "#fff",
            logo: "https://media.infojobs.net/portales/ij/appgrade/svgs/ij-logo_reduced.svg",
            bgDark: "#1D2635",
            logoDark: "https://media.infojobs.net/portales/ij/appgrade/svgs/ij-logo_reduced.svg",
            text: "#000",
            textDark: "#fff"
        },
        options
    };
}
