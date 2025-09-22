// app/api/powerbi/route.ts
import { NextResponse } from 'next/server';

/**
 * Acquire an Azure AD token for the Power BI API using client‑credentials.
 */
async function getAzureAccessToken() {
  const tenantId = process.env.POWERBI_TENANT_ID!;
  const clientId = process.env.POWERBI_CLIENT_ID!;
  const clientSecret = process.env.POWERBI_CLIENT_SECRET!;

  const res = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'https://analysis.windows.net/powerbi/api/.default',
        grant_type: 'client_credentials',
      }),
    },
  );
  const json = await res.json();
  return json.access_token as string;
}

// Runs on the edge runtime; remove if you are not deploying on Cloudflare/edge.
export const runtime = 'edge';

/**
 * POST: generate an embed token using an effective identity (RLS)
 * Expects { username: string } in the request body.
 */
export async function POST(request: Request) {
  const { username } = await request.json();
  const workspaceId = process.env.POWERBI_WORKSPACE_ID!;
  const reportId = process.env.POWERBI_REPORT_ID!;
  const rlsRole = process.env.POWERBI_RLS_ROLE_NAME || 'UserRole';

  const accessToken = await getAzureAccessToken();

  // Get the report metadata (to retrieve datasetId and embedUrl)
  const reportRes = await fetch(
    `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  const reportData = await reportRes.json();
  const embedUrl = reportData.embedUrl;
  const datasetId = reportData.datasetId;

  // Build the token request with effective identity
  const tokenRes = await fetch(
    `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessLevel: 'view',
        identities: [
          {
            // username can be any string when using static roles, but must match
            // your RLS logic (e.g., email) when using dynamic roles:contentReference[oaicite:0]{index=0}.
            username: username || 'viewer',
            roles: [rlsRole],
            datasets: [datasetId],
          },
        ],
      }),
    },
  );
  const tokenData = await tokenRes.json();

  return NextResponse.json({
    reportId,
    embedUrl,
    embedToken: tokenData.token,
  });
}

/**
 * GET: preserve previous behaviour (no RLS).
 */
export async function GET() {
  const workspaceId = process.env.POWERBI_WORKSPACE_ID!;
  const reportId = process.env.POWERBI_REPORT_ID!;
  const accessToken = await getAzureAccessToken();

  const reportRes = await fetch(
    `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  const reportData = await reportRes.json();
  const embedUrl = reportData.embedUrl;

  const tokenRes = await fetch(
    `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessLevel: 'view' }),
    },
  );
  const tokenData = await tokenRes.json();

  return NextResponse.json({
    reportId,
    embedUrl,
    embedToken: tokenData.token,
  });
}
