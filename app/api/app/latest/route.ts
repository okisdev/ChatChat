import { getLatestVersion } from '@/utils/app/version';

export async function GET(request: Request) {
    const latestVersion = await getLatestVersion({ owner: 'okisdev', repo: 'ChatChat' });

    return Response.json(
        {
            short: { version: latestVersion.tag_name, version_name: latestVersion.name },
            details: latestVersion,
        },
        { status: 200 }
    );
}
