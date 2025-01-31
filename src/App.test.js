import {render, screen, waitFor} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import App from './App';

let textInputs;
let searchInput;
let fromYearInput;
let toYearInput;

const mockCount = 100;
const mockWebEnv = "ABC123";
const mockQueryKey = 1;
const mockResponse = `<eSearchResult><Count>${mockCount}</Count><QueryKey>${mockQueryKey}</QueryKey><WebEnv>${mockWebEnv}</WebEnv></eSearchResult>`
let container;

beforeEach(() => {
  container = render(<App/>).container;
  textInputs = screen.getAllByRole('textbox');
  searchInput = textInputs[0];
  fromYearInput = textInputs[1];
  toYearInput = textInputs[2];
})

describe('Search Form', () => {
  it('renders text inputs with default values', () => {
    expect(textInputs.length).toEqual(3);
    expect(searchInput).toHaveValue("");
    expect(fromYearInput).toHaveValue("2020");
    expect(toYearInput).toHaveValue("2020");
  });

  it('shows error message when search term is empty', () => {
    userEvent.click(screen.getByText('Get Results'));
    expect(screen.getByText("Please enter a search term")).toBeVisible();
  });

  it('shows error message when from year is empty', async () => {
    userEvent.type(searchInput, 'search');
    userEvent.type(fromYearInput, '{backspace}{backspace}{backspace}{backspace}')
    userEvent.click(screen.getByText('Get Results'));
    await waitFor(() => expect(screen.getByText("Please enter a FROM year")).toBeVisible());
  });

  it('shows error message when to year is empty', async () => {
    userEvent.type(searchInput, 'search');
    userEvent.type(toYearInput, '{backspace}{backspace}{backspace}{backspace}')
    userEvent.click(screen.getByText('Get Results'));
    await waitFor(() => expect(screen.getByText("Please enter a TO year")).toBeVisible());
  });

  it('shows error message when to year is less than from year', () => {
    userEvent.type(searchInput, 'search');
    userEvent.type(fromYearInput, '{backspace}{backspace}{backspace}{backspace}2020')
    userEvent.type(toYearInput, '{backspace}{backspace}{backspace}{backspace}1980')
    userEvent.click(screen.getByText('Get Results'));
    expect(screen.getByText("TO must come after FROM")).toBeVisible();
  });
});

describe('App', () => {
  let mockServer;

  beforeEach(() => {
    const apiEndpoint = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`;
    mockServer = setupServer(
        rest.get(apiEndpoint, (req, res, ctx) => {
          return res(ctx.xml(mockResponse))
        })
    )
    mockServer.listen();
  });

  afterEach(() => {
    mockServer.close();
  });

  it('displays chart when valid search parameters given', async () => {

    expect(screen.queryByTestId("chart-container")).toBeNull();

    userEvent.type(searchInput, 'search');
    userEvent.click(screen.getByText('Get Results'));

    await waitFor(() => expect(screen.getByTestId("chart-container")).toBeVisible());
  });
});