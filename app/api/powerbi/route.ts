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

export async function GET() {
  const workspaceId = process.env.POWERBI_WORKSPACE_ID!;
  const reportId = process.env.POWERBI_REPORT_ID!;
  const accessToken = await getAzureAccessToken();

  // Get embed URL
  const reportRes = await fetch(
    `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  const reportData = await reportRes.json();
  const embedUrl = reportData.embedUrl;

  // Generate embed token (view only)
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
