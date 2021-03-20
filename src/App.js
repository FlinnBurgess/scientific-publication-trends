import './App.css';
import {useState} from 'react';
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import InputForm from "./inputs/InputForm";

function App() {
    const [searchParameters, setSearchParameters] = useState({from: 2020, to: 2020, searchTerm: ''});
    const [resultSet, setResultSet] = useState([]);
    const [maxCount, setMaxCount] = useState(0);

    const parser = new DOMParser();

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const getResults = async () => {
        setResultSet([]);
        setMaxCount(0);
        let year;

        for (year = searchParameters['from']; year <= searchParameters['to']; year++) {
            let res = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${searchParameters['searchTerm']}&datetype=pdat&mindate=${year}&maxdate=${year}`);
            let body = await res.text();

            const xml = parser.parseFromString(body, "text/xml");
            let count = xml.getElementsByTagName("eSearchResult")[0].getElementsByTagName("Count")[0].childNodes[0].nodeValue;

            setResultSet(oldResultSet => ([
                ...oldResultSet,
                {year: year, count: count}
            ]))

            setMaxCount(currentMax => Math.max(currentMax, Number(count)));

            await delay(200);
        }
    }

    return (
        <div className="App">
            <InputForm searchParameters={searchParameters} setSearchParameters={setSearchParameters}
                       getResults={getResults}/>

            {
                resultSet.length > 0 &&
                <div className="Chart-container" data-testid={"chart-container"}>
                    <BarChart width={1500} height={600} data={resultSet}
                              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                        <XAxis dataKey={"year"}/>
                        <YAxis type={"number"} domain={[0, maxCount]}/>
                        <Bar dataKey={"count"} fill={"#82ca9d"}/>
                        <Tooltip/>
                    </BarChart>
                </div>

            }
        </div>
    );
}

export default App;
