Docs: https://playwright.dev/docs/running-tests

run tests:

`npx playwright test`

Run specific file:

`npx playwright test <file-name>`

Select browser: `--project=chromium`
Open GUI: `--headed`

Prevent results from opening: `reporter: [["html", { open: "never" }]]`
