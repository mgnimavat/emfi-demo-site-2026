# Fund search

Find Funds on the main Asset & Wealth Management page searches by long fund name or ISIN. The browser sends queries of 2–180 characters to `GET /api/funds/search?q=LU` and receives up to 12 ranked matches.

## Workbook catalogue

The API reads `src/content/data/fund-universe.json.gz` on the server. It contains the long name and available ISIN, fund house, fund family currency, income treatment, domicile, LEI, and share decimal precision for each entry. The import merges duplicate ISINs and keeps entries with invalid ISINs searchable by name.

To refresh the catalogue, replace the compressed JSON snapshot and deploy it with the site. Keep the source workbooks in the ignored `Fund/` directory. The application reads the generated archive directly with Node.js.

## Optional provider override

Set the server environment variable `EMFI_FUND_SEARCH_URL` to a search endpoint that accepts `GET` with `q` and `limit` parameters. If the service uses bearer authentication, set `EMFI_FUND_SEARCH_API_KEY` on the server. The upstream sorts and filters the results before returning them.

```json
{
  "results": [
    {
      "id": "fund-id",
      "name": "Fund long name",
      "familyCurrency": "USD",
      "incomeTreatment": "ACC"
    }
  ],
  "hasMore": false
}
```

Each result needs a unique public `id` and a `name`. The endpoint can supply the same detail fields as the workbook snapshot. Use `ACC` for accumulation and `INC` for income distribution. Set `hasMore` when a query matches more than the requested limit. The public route adds a `source` of `workbook` or `provider`.
