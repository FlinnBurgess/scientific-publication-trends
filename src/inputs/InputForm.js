import {useState} from 'react';
import {Button, TextField} from '@material-ui/core'

function InputForm({searchParameters, setSearchParameters, getResults}) {
    const [searchError, setSearchError] = useState('');
    const [toError, setToError] = useState('');
    const [fromError, setFromError] = useState('');

    const validateAndSetYear = (value, valueSetter) => {
        if (value === '') {
            valueSetter('');
        } else if ((Number(value) == value)) {
            valueSetter(parseInt(value));
        }
    }

    const resetErrors = () => {
        setSearchError("");
        setFromError("");
        setToError("");
    }

    const validateAndSubmitForm = () => {
        resetErrors();

        if (searchParameters['searchTerm'] === "") {
            setSearchError("Please enter a search term")
            return;
        } else if (!searchParameters['from']) {
            setFromError("Please enter a FROM year")
            return;
        } else if (!searchParameters['to']) {
            setToError("Please enter a TO year")
            return;
        } else if (searchParameters['to'] < searchParameters['from']) {
            setToError("TO must come after FROM")
            return;
        }

        getResults();
    }

    return (
        <form noValidate autoComplete="off" onSubmit={(event) => {
            event.preventDefault()
            validateAndSubmitForm()
        }}>
            <TextField
                placeholder={"Search"}
                value={searchParameters['searchTerm']}
                label={"Search"}
                error={searchError !== ''}
                helperText={searchError}
                onChange={(e) => setSearchParameters({...searchParameters, searchTerm: e.target.value})}/>
            <TextField
                placeholder={"From Year"}
                value={searchParameters['from']}
                label={"From Year"}
                error={fromError !== ''}
                helperText={fromError}
                onChange={(e) => validateAndSetYear(e.target.value, (value) => setSearchParameters({...searchParameters, from: value}))}/>
            <TextField
                placeholder={"To Year"}
                value={searchParameters['to']}
                label={"To Year"}
                error={toError !== ''}
                helperText={toError}
                onChange={(e) => validateAndSetYear(e.target.value, (value) => setSearchParameters({...searchParameters, to: value}))}/>

            <Button type={"submit"} color={"primary"}>Get Results</Button>
        </form>
    )
}

export default InputForm;