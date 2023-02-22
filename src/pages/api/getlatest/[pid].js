import axios from 'axios';
import { Octokit } from 'octokit';

export default function handler(req, res) {
    const { pid } = req.query

    let lib = pid;

    if (pid.includes("|")) {
        lib = pid.replace("|", "/");
    }

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        url: 'https://registry.npmjs.org/' + lib + '/latest',
    };

    let packageName = pid.replace("|", "/");

    // let github = `https://api.github.com/repos/${owner}/${repo}/releases/tags/v${version}`


    axios(options)
        .then((response) => {

            var data = response.data;
            let owner = response.data.repository.url.split("/")[3];
            let repo = response.data.repository.url.split("/")[4].replace(".git", "");

            const octokit = new Octokit({
                auth: process.env.NEXT_PUBLIC_GITHUB_KEY,
            })

            octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
                owner: owner,
                repo: repo,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            }).then((github) => {
                const published = github.data.published_at;

                res.status(200).json({
                    package: packageName,
                    version: data.version,
                    release: published,
                    url: data.repository.url.replace(".git", "").replace("git+", "").replace("git://", "https://")
                });

            }).catch((error) => {

                res.status(200).json({
                    package: packageName,
                    version: data.version,
                    release: null,
                    url: data.repository.url.replace(".git", "").replace("git+", "").replace("git://", "https://")
                });
            });

        })
        .catch((error) => {
            res.status(200).json({
                package: packageName,
                version: data.version,
                release: null
            });
        });






}