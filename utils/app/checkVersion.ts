export const getGitHubLatestVersion = async ({ owner, repo }: { owner: string; repo: string }) => {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);

    return await response.json();
};
