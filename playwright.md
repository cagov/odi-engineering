# Playwright Testing 

## Using codegen

The playwright codegen tool is a nice way to get going quickly with a new playwright test. You can launch it, click around the site you want ot test and review the test script it generates on the fly. 

To launch a codegen session starting with the CA covid19 homepage run:

```
npx playwright codegen https://covid19.ca.gov
```

### Caveat

Playwright codegen does not make useful selector choices though. It is often identifying elements by the text they contain so in order to create useful tests the element selector criteria have to be rewritten to use classnames or something less brittle than the visible text on the page.
## Launch in debug mode

Set PWDEBUG=1 before launching tests to get the interactive debugger to launch.

Example command:
```
PWDEBUG=1 npx playwright test includes.spec.mjs
```

This will launch the page in a visible incognito window along with a script step controller. The script pauses on the first step by default and you can step over it or play through the whole script via the debugger window buttons.

## Pausing scripts

You shouldn't need to add any pauses in normal test writing because playwright uses <a href="https://playwright.dev/docs/actionability/">auto waiting</a>

You may want to insert pauses in scripts if you are debugging with visual inspection. If this is in your test script
```
await page.pause();
```

Playwright will stop performing test operations and wait for the debugger resume button to be clicked in the debugger overlay or execute resume from devtools console:
```
playwright.resume()
```

## Includes

# Playwright Testing 

## Includes

We can put some test steps in separate files and reuse them in multiple places. An example is in <a href="test/includes/search.mjs">test/includes/search.mjs</a>:

The snippet submits the search form:
```
async function search(page) {
  await page.fill('#header-search-site', 'vaccine')
  await page.click('.header-search-button')
  await page.isVisible('#answersNow')
}
export default search;
```

An example of it being used is in <a href="test/includes.spec.mjs">test/includes.spec.mjs</a>:
- Import the file:
```
import search from './includes/search.mjs';
```
- Call the function passing in page
```
search(page);
```

## Triggering POST directly

Playwright can override attributes of route requests. If you want to submit a POST request without finding and clicking on form elements you can do that directly.

Here is an example of a route overriding the POST body being sent to a specific url:
```
  await page.route('https://api.alpha.ca.gov/WasHelpful', (route, request) => {
    const method = 'POST';
    const postData = '{"url":"https://staging.covid19.ca.gov/","helpful":"yes","comments":"testing2","userAgent":"Playwright"}';
    route.continue({ method, postData });
  });
```

If the above route handler is in your script it will be invoked when that url is called like:8
```
  const response = page.goto('https://api.alpha.ca.gov/WasHelpful');
```

## Mocking network requests

The <a href="https://playwright.dev/docs/api/class-route">route object</a> can be used to override responses using route.fulfill. This is useful if you want to return a mocked up dataset during a test instead of live data.

<a href="https://try.playwright.tech/?l=javascript&e=intercept-modify-requests">Here</a> is an example of intercepting and modifying network requests during a test.

## Run javascript in page context

It may be convenient to execute client side javascript as if it were running in the page during a test.

Use page.evaluate for this.

We had a test that checked to see if the Google Analytics code was recording information as expected and used page.evaluate to interact with the window object and return information about GA we could review in the test:
```
  const dataLayerAfterAnchorClick = await page.evaluate(() => {
    return Promise.resolve(window.gaData['UA-3419582-2'].hitcount);
  },);
```  