import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox"])
        page = await browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
        await page.goto("http://localhost:5173/", wait_until="networkidle")

        # Load CSE branch to populate all 8 semesters
        await page.select_option("#branch-select", "cse")
        await page.wait_for_timeout(800)

        # Scroll to a semester card region to capture mobile course cards
        await page.evaluate("document.querySelector('h2')?.scrollIntoView()")
        await page.wait_for_timeout(500)
        await page.screenshot(path="/home/ubuntu/AKTU_RESULT_CALCULATOR/mobile_top.png")

        # Scroll down to first semester's course cards and paste button
        await page.evaluate("""
            const tables = document.querySelectorAll('.card');
            if (tables[1]) tables[1].scrollIntoView({block: 'start'});
        """)
        await page.wait_for_timeout(500)
        await page.screenshot(path="/home/ubuntu/AKTU_RESULT_CALCULATOR/mobile_semester.png")

        # Open the paste box on semester 1 and screenshot
        await page.click("button:text('Paste marks')")
        await page.wait_for_timeout(400)
        await page.screenshot(path="/home/ubuntu/AKTU_RESULT_CALCULATOR/mobile_paste.png")

        # Scroll to yearly GPA section
        await page.evaluate("document.body.scrollBy(0, 4000)")
        await page.wait_for_timeout(500)
        await page.screenshot(path="/home/ubuntu/AKTU_RESULT_CALCULATOR/mobile_ygpa.png")

        # Fill marks via the paste box and verify populated card rendering
        await page.click("button:text('Close paste')")
        await page.wait_for_timeout(200)
        await page.click("button:text('Paste marks')")
        await page.wait_for_timeout(300)
        await page.fill("textarea", "25 65 50 50 22 40 21 65 40 50")
        await page.click("button:text('Fill semester')")
        await page.wait_for_timeout(500)
        await page.evaluate("""
            const tables = document.querySelectorAll('.card');
            if (tables[1]) tables[1].scrollIntoView({block: 'start'});
        """)
        await page.wait_for_timeout(400)
        await page.screenshot(path="/home/ubuntu/AKTU_RESULT_CALCULATOR/mobile_filled.png")

        await browser.close()

asyncio.run(main())
print("done")
