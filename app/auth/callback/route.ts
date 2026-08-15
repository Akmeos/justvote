import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (errorParam || errorDescription) {
    console.error("OAuth callback error received:", errorParam, errorDescription);
    return NextResponse.redirect(`${origin}${next}?auth_error=${encodeURIComponent(errorDescription || errorParam || "OAuth login error")}`);
  }

  if (code) {
    const cookieStore = cookies();
    let response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
                response.cookies.set(name, value, options);
              });
            } catch (err) {
              // Ignore
            }
          },
        },
      }
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return response;
    } else {
      console.error("Auth callback session exchange error:", exchangeError);
      return NextResponse.redirect(`${origin}${next}?auth_error=${encodeURIComponent(exchangeError.message)}`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
