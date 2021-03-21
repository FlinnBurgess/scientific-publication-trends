# Scientific Publication Trends

This web app displays trends in publication rates using the ncbi e-utilites. The charting is performed using Recharts, and the Google Maps API  is used for displaying a map of publication locations.

## Using the app

In order to run the app locally, navigate to the project directory and run `npm run start`. If the browser doesn't automatically launch, then navigate manually to [http://localhost:3000](http://localhost:3000).

Enter a search term and a timespan, then click `GET RESULTS` or hit enter to perform the search.

Once the chart has been generated, you can click on each bar to see a map of the countries of origin of the first 100 results.

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.