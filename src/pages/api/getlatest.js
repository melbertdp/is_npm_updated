import axios from 'axios';

export default function handler(req, res) {

    console.log("reqqqq", req);

    // const { title, post } = JSON.parse(req.body);


    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        url: 'https://registry.npmjs.org/' + "next" + '/latest',
    };


    // let github = `https://api.github.com/repos/${owner}/${repo}/releases/tags/v${version}`


    axios(options)
        .then((response) => {

            let owner = response.data.repository.url.split("/")[3];
            let repo = response.data.repository.url.split("/")[4].replace(".git", "");

            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                url: `https://api.github.com/repos/${owner}/${repo}/releases/tags/v${response.data.version}`,
            };

            axios(options)
                .then((github) => {

                    res.status(200).json({
                        version: response.data.version,
                        release: github.data.published_at
                    });

                })
                .catch((error) => {
                    res.status(500).json(error);
                });
        })
        .catch((error) => {
            res.status(500).json(error);
        });






}