async function search(page) {
  await page.fill('#header-search-site', 'vaccine')
  await page.click('.header-search-button')
  await page.isVisible('#answersNow')
}
export default search;
