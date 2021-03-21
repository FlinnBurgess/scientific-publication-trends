import {useEffect, useState} from "react";
import {CircularProgress} from "@material-ui/core";

function DistributionMap({mapData}) {
    const [loading, setLoading] = useState(true);
    const [countryCoordinateList, setCountryCoordinateList] = useState([]);

    const googleApiKey = "AIzaSyAOyIxO1_eCPz6laJ7gKuFuGe_HnqUiGjw";

    useEffect(() => {
        setLoading(true);
        const parser = new DOMParser();
        const fetchData = async () => {
            let res = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&query_key=${mapData.queryKey}&WebEnv=${mapData.webEnv}&retmode=xml&retmax=100`);
            let body = await res.text();

            const articleSet = parser.parseFromString(body, "text/xml")
                .getElementsByTagName("PubmedArticleSet")[0]
                .getElementsByTagName("PubmedArticle");

            const countriesFound = [...articleSet].map((article) => {
                const countryElement = article.getElementsByTagName("MedlineCitation")[0].getElementsByTagName("MedlineJournalInfo")[0].getElementsByTagName("Country")[0];
                return countryElement === undefined ? undefined : countryElement.childNodes[0].nodeValue;
            }).filter(country => country !== undefined);

            const countryCoordinates = await Promise.all([...new Set(countriesFound)].map(async (country) => {
                const geoCodeRes = await (await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${country}&key=${googleApiKey}`)).text();
                const responseObject = JSON.parse(geoCodeRes);
                return responseObject['results'][0]['geometry']['location'];
            }))

            setCountryCoordinateList(countryCoordinates);

            setLoading(false);
        }

        fetchData();
    }, [mapData.queryKey, mapData.webEnv])

    const generateGmapsUrl = () => {
        const reducer = (acc, current) => acc + `|${current['lat']},${current['lng']}`;
        const markerInfo = countryCoordinateList.reduce(reducer, '');

        return `https://maps.googleapis.com/maps/api/staticmap?size=1000x600&markers=${markerInfo}&key=${googleApiKey}`
    };

    return (
        <div className={"Map-container"} data-testid={"map-container"}>
            <h3>Global Distribution of the Top 100 Results</h3>
            {loading ? <CircularProgress/> :
                <img src={generateGmapsUrl()} alt={"Google map of publication countries"}/>}
        </div>
    )
}

export default DistributionMap;