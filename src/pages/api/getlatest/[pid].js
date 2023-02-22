import axios from 'axios';

export default function handler(req, res) {
    const { pid } = req.query
    console.log("reqqqq", pid);

    // const { title, post } = JSON.parse(req.body);


    //check if pid has | and replace it with /

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


    // let github = `https://api.github.com/repos/${owner}/${repo}/releases/tags/v${version}`


    axios(options)
        .then((response) => {

            res.status(200).json({
                package: pid.replace("|", "/"),
                version: response.data.version
            });

            // let owner = response.data.repository.url.split("/")[3];
            // let repo = response.data.repository.url.split("/")[4].replace(".git", "");

            // const options = {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     url: `https://api.github.com/repos/${owner}/${repo}/releases/tags/v${response.data.version}`,
            // };

            // axios(options)
            //     .then((github) => {

            //         res.status(200).json({
            //             package: pid,
            //             version: response.data.version,
            //             release: github.data.published_at
            //         });

            //     })
            //     .catch((error) => {
            //         res.status(500).json(error);
            //     });
        })
        .catch((error) => {
            res.status(500).json(error);
        });






}