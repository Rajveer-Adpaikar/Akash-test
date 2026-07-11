import asyncio, sys
from playwright.async_api import async_playwright
BASE = 'http://localhost:5177/akash-the-band/'
async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(BASE, wait_until='networkidle', timeout=30000)
        await page.wait_for_timeout(2000)
        print(await page.title())
        await browser.close()

asyncio.run(main())
