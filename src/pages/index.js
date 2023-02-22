import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'

import Papa from 'papaparse'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLibVersion = async (lib) => {
    return await axios
      .get(`/api/getlatest/${lib}`,)
      .then(res => res.data);
  }

  const getLatestVersion = async (keys) => {

    const lib = keys;

    return await Promise.all(lib.map(async (lib) => {

      let pack = lib;

      if (pack.includes("/")) {
        pack = pack.replace("/", "|");
      }

      return await getLibVersion(pack);
    }))
  }

  const handleDownload = () => {
    
    if (!data) return;

    var dt = Papa.unparse(data);

    var blob = dt.constructor !== Blob
      ? new Blob([dt], { type: 'application/octet-stream' })
      : dt;

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, "package.csv");
      return;
    }

    var lnk = document.createElement('a'),
      url = window.URL,
      objectURL;

    lnk.download = "package.csv";
    lnk.href = objectURL = url.createObjectURL(blob);
    lnk.dispatchEvent(new MouseEvent('click'));
    setTimeout(url.revokeObjectURL.bind(url, objectURL));
  }

  const handleUpload = (e) => {
    setLoading(true);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (e) => {
      const json = JSON.parse(e.target.result);

      const { dependencies, devDependencies } = json;

      let depKeys = Object.keys(dependencies);
      let depDevKeys = Object.keys(devDependencies);

      let val = await getLatestVersion(depKeys);


      console.log("==val",val)

      var depArray = [];

      depKeys.forEach(element => {

        depArray.push({
          package: element,
          current: dependencies[element],
          latest: val.filter(x => x.package == element)[0].version
        });

      });
      setLoading(false)
      setData(depArray);
      Papa.unparse(depArray)
    }
  }

  return (
    <>
      <Head>
        <title>Is My Packages Latest?</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid min-h-full place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">Is My Packages Latest?</p>
          <h1 className="mt-4 text-base tracking-tight text-gray-900">
            {
              loading && <div>Loading...</div>
            }
            {
              data.map((item, index) => {
                return <div key={index}>

                  <div className='flex'>
                    <div className='mr-5'>{item.package}:</div>
                    <div>{item.current}</div>
                    <div className='mx-3'> {"  →  "} </div>
                    <div>{item.latest}</div>
                  </div>
                </div>
              })
            }

            {
              data.length > 0 && <button className='mt-10 bg-indigo-500 text-white' onClick={handleDownload}>Download</button>
            }
          </h1>
          <div className="mt-6 text-base leading-7 text-gray-600">
            <h1>Import Package.json</h1>
            <input type="file" onChange={handleUpload} />
          </div>

        </div>
      </main>
    </>
  )
}
