import './App.css';
import {useState} from 'react';
import {BarChart, Bar, XAxis, YAxis, Tooltip} from 'recharts';
import InputForm from "./inputs/InputForm";
import DistributionMap from "./map/DistributionMap";

function App() {
    const [searchParameters, setSearchParameters] = useState({from: 2020, to: 2020, searchTerm: ''});
    const [resultSet, setResultSet] = useState([]);
    const [maxCount, setMaxCount] = useState(0);
    const [mapData, setMapData] = useState({});

    const parser = new DOMParser();

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const getResults = async () => {
        setResultSet([]);
        setMaxCount(0);
        setMapData({});
        let year;

        for (year = searchParameters['from']; year <= searchParameters['to']; year++) {
            let res = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${searchParameters['searchTerm']}&datetype=pdat&mindate=${year}&maxdate=${year}&usehistory=y`);
            let body = await res.text();

            const result = parser.parseFromString(body, "text/xml").getElementsByTagName("eSearchResult")[0];
            let count = result.getElementsByTagName("Count")[0].childNodes[0].nodeValue;
            let queryKey = result.getElementsByTagName("QueryKey")[0].childNodes[0].nodeValue;
            let webEnv = result.getElementsByTagName("WebEnv")[0].childNodes[0].nodeValue;

            setResultSet(oldResultSet => ([
                ...oldResultSet,
                {year: year, count: count, queryKey: queryKey, webEnv: webEnv}
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
                    <BarChart width={1000} height={600} data={resultSet}
                              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                        <XAxis dataKey={"year"}/>
                        <YAxis type={"number"} domain={[0, maxCount]}/>
                        <Bar dataKey={"count"} fill={"#82ca9d"} onClick={(e) => {
                            setMapData({queryKey: e.queryKey, webEnv: e.webEnv})
                        }} className={"chart-bar"} />
                        <Tooltip/>
                    </BarChart>
                </div>
            }

            {
                Object.keys(mapData).length > 0 &&
                <DistributionMap mapData={mapData}/>
            }
        </div>
    );
}

export default App;
