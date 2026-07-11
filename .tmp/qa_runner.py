import asyncio, sys
from playwright.async_api import async_playwright
BASE = "http://localhost:5177/akash-the-band/"
issues = []
Q = chr(34)
def p(l): print("[PASS]", l)
def f(l, d): print("[FAIL]", l, "-", d); issues.append({"label": l, "detail": d})
async def fresh_page(pw):
    browser = await pw.chromium.launch(headless=True)
    context = await browser.new_context(viewport={"width": 1440, "height": 900})
    page = await context.new_page()
    errors = []
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    page.on("pageerror", lambda err: errors.append(str(err)))
    await page.goto(BASE, wait_until="load", timeout=15000)
    await page.wait_for_timeout(2000)
    return browser, context, page, errors
async def main():
    async with async_playwright() as pw:
        print("")
        print("=== 1. PAGE LOADS ===")
        browser, ctx, page, errors = await fresh_page(pw)
        critical = [e for e in errors if not any(x in e for x in ["favicon","cross-origin","third-party","vimeo","Vimeo"])]
        if critical: f("Console errors", " | ".join(critical[:3]))
        else: p("No critical console errors")
        title = await page.title()
        if title: p("Title: " + title)
        else: f("Title", "Missing")
        for sid in ["hero","about","reels","services","contact"]:
            el = await page.query_selector("#" + sid)
            if el: p("Section #" + sid + " exists")
            else: f("Section #" + sid, "Not found")
        await page.screenshot(path=".tmp/full-page.png", full_page=True)
        p("Full page screenshot captured")
        await browser.close()
        print("")
        print("=== 2. NAVIGATION ===")
        browser, ctx, page, _ = await fresh_page(pw)
        nav_items = [["About", "#about"], ["Events", "#reels"], ["Services", "#services"], ["Contact", "#contact"]]
        for label, href in nav_items:
            js = "(links) => links.some(l => l.textContent.trim() === " + Q + label + Q + " && l.getAttribute(" + Q + "href" + Q + ") === " + Q + href + Q + ")"
            found = await page.eval_on_selector_all("nav a", js)
            if found: p("Nav " + label + " with " + href)
            else: f("Nav " + label, "Not found")
        for label, href in nav_items:
            sid = href[1:]
            js2 = "(links) => { const l = links.find(a => a.textContent.trim() === " + Q + label + Q + "); if (l) { l.click(); } }"
            await page.eval_on_selector_all("nav a", js2)
            await page.wait_for_timeout(800)
            try:
                top = await page.eval_on_selector("#" + sid, "(el) => el.getBoundingClientRect().top")
                if top is not None:
                    if -60 <= top <= 300: p("Click " + label + " -> #" + sid + " visible (top=" + str(round(top)) + ")")
                    else: f("Nav click " + label, "top=" + str(round(top)) + " (page height=" + str(await page.eval_on_selector("body", "(b) => b.scrollHeight")) + ")")
            except: f("Nav click " + label, "Could not verify")
        await browser.close()
        print("")
        print("=== 3. HERO ===")
        browser, ctx, page, _ = await fresh_page(pw)
        js_mute = "(btns) => { const b = btns.find(x => x.getAttribute(" + Q + "aria-label" + Q + ") === " + Q + "Unmute" + Q + " || x.getAttribute(" + Q + "aria-label" + Q + ") === " + Q + "Mute" + Q + "); return b ? b.getAttribute(" + Q + "aria-label" + Q + ") : null; }"
        mute_state = await page.eval_on_selector_all("button", js_mute)
        if mute_state:
            p("Mute button state: " + mute_state)
            js2 = "(btns) => { const b = btns.find(x => x.getAttribute(" + Q + "aria-label" + Q + ") === " + Q + mute_state + Q + "); if (b) b.click(); }"
            await page.eval_on_selector_all("button", js2)
            await page.wait_for_timeout(300)
            ns = await page.eval_on_selector_all("button", js_mute)
            if ns and ns != mute_state: p("Mute toggle: " + mute_state + " -> " + ns)
            else: f("Mute toggle", "State unchanged")
        else: f("Mute button", "Not found")
        js_cta = "(btns) => btns.some(b => b.textContent.includes(" + Q + "Inquire Now" + Q + "))"
        if await page.eval_on_selector_all("button", js_cta): p("Hero Inquire Now CTA exists")
        else: f("Hero CTA", "Not found")
        js_vim = "(iframes) => iframes.some(i => (i.src || " + Q + Q + ").includes(" + Q + "vimeo" + Q + "))"
        if await page.eval_on_selector_all("iframe", js_vim): p("Vimeo iframe present")
        else: f("Vimeo iframe", "Not found")
        if await page.query_selector("nav"): p("Navigation bar present")
        else: f("Nav bar", "Not found")
        await browser.close()
        print("")
        print("=== 4. SOCIAL PROOF ===")
        browser, ctx, page, _ = await fresh_page(pw)
        body = await page.text_content("body") or ""
        for stat in ["796K", "32K", "6", "Birla White"]:
            if stat in body: p("Stat " + stat + " visible")
            else: f("Stat " + stat, "Not visible")
        await browser.close()
        print("")
        print("=== 5. FEATURES ===")
        browser, ctx, page, _ = await fresh_page(pw)
        await page.eval_on_selector("#services", "(el) => el.scrollIntoView({block: " + Q + "center" + Q + "})")
        await page.wait_for_timeout(1500)
        ft = await page.text_content("#services") or ""
        if "Your event. Our stage." in ft: p("Features header correct")
        else: f("Features header", "Not found")
        for cat in ["Live Performances", "Corporate Events", "Destination Weddings"]:
            if cat in ft: p("Card " + cat + " present")
            else: f("Card " + cat, "Not found")
        # Case-insensitive group photo search
        grp = await page.eval_on_selector_all("img[alt*=group], img[alt*=Group]", "(imgs) => imgs.map(i => i.src)")
        if grp: p("Group photo: " + grp[0])
        else: f("Group photo", "Not found")
        await browser.close()
        print("")
        print("=== 6. MODAL ===")
        browser, ctx, page, _ = await fresh_page(pw)
        await page.eval_on_selector("#services", "(el) => el.scrollIntoView({block: " + Q + "center" + Q + "})")
        await page.wait_for_timeout(500)
        js_inq = "(btns) => { const b = btns.find(x => x.textContent.includes(" + Q + "Inquire now" + Q + ")); if (b) { b.click(); return true; } return false; }"
        clicked = await page.eval_on_selector_all("#services button", js_inq)
        await page.wait_for_timeout(500)
        p("Button clicked: " + str(clicked))
        dialog = await page.query_selector("[role=" + Q + "dialog" + Q + "]")
        if dialog:
            p("Modal opens")
            sub_btn = await page.query_selector("button[type=" + Q + "submit" + Q + "]")
            if sub_btn:
                await sub_btn.click(); await page.wait_for_timeout(300)
            mt = await page.text_content("[role=" + Q + "dialog" + Q + "]") or ""
            if "Name is required" in mt: p("Validation: empty name")
            else: f("Validation: name", "Not shown")
            if "Phone number is required" in mt: p("Validation: empty phone")
            else: f("Validation: phone", "Not shown")
            phone = await page.query_selector("input[type=" + Q + "tel" + Q + "]")
            if phone:
                await phone.fill("abc")
                if sub_btn: await sub_btn.click(); await page.wait_for_timeout(200)
            mt2 = await page.text_content("[role=" + Q + "dialog" + Q + "]") or ""
            if "Enter a valid phone number" in mt2: p("Validation: invalid phone")
            else: f("Validation: phone format", "Not shown")
            ni = await page.query_selector("input[placeholder*=Name]")
            if ni: await ni.fill("QA Tester")
            if phone:
                await phone.fill("")
                await phone.fill("+919923837062")
            ei = await page.query_selector("input[type=" + Q + "email" + Q + "]")
            if ei: await ei.fill("qa@test.com")
            if sub_btn:
                await sub_btn.click(); await page.wait_for_timeout(500)
            try:
                mt3 = await page.text_content("[role=" + Q + "dialog" + Q + "]") or ""
                if "reach out" in mt3 or "Thank" in mt3: p("Form success state")
                elif "Failed" in mt3: print("[NOTE] Web3Forms unavailable")
            except: print("[NOTE] Modal closed (mailto)")
            await page.keyboard.press("Escape"); await page.wait_for_timeout(300)
            if not await page.query_selector("[role=" + Q + "dialog" + Q + "]"): p("Modal closes on Escape")
            else: f("Modal ESC close", "Still visible")
        else: f("Inquiry modal", "Did not open after click=" + str(clicked))
        await browser.close()
        print("")
        print("=== 7. FLOATING CTA ===")
        browser, ctx, page, _ = await fresh_page(pw)
        wa = await page.query_selector_all("a[href*=" + Q + "wa.me" + Q + "]")
        if wa:
            p("WhatsApp links: " + str(len(wa)))
            href = await wa[0].get_attribute("href")
            target = await wa[0].get_attribute("target") or ""
            rel = await wa[0].get_attribute("rel") or ""
            p("  href=" + href + " target=" + target + " rel=" + rel)
        else: f("WhatsApp link", "Not found")
        ph = await page.query_selector_all("a[href=" + Q + "tel:+919923837062" + Q + "]")
        if ph: p("Phone links: " + str(len(ph)))
        else: f("Phone link", "Not found")
        await browser.close()
        print("")
        print("=== 8. FOOTER ===")
        browser, ctx, page, _ = await fresh_page(pw)
        ft_el = await page.query_selector("footer")
        if ft_el:
            p("Footer section present")
            chk = [
                ["Instagram", "a[href*=" + Q + "instagram.com/akash_theband" + Q + "]"],
                ["WhatsApp", "a[href*=" + Q + "wa.me/919923837062" + Q + "]"],
                ["Phone", "a[href=" + Q + "tel:+919923837062" + Q + "]"],
                ["Email", "a[href*=" + Q + "mailto:kanwarbharat@gmail.com" + Q + "]"],
            ]
            for label, sel in chk:
                els = await page.query_selector_all(sel)
                if els:
                    h = await els[0].get_attribute("href")
                    p(label + ": " + str(h))
                    if label not in ["Phone", "Email"]:
                        tgt = await els[0].get_attribute("target") or ""
                        r = await els[0].get_attribute("rel") or ""
                        if tgt == "_blank": p("  opens in new tab")
                        if "noopener" in r: p("  has noopener")
                else: f(label, "Not found")
            ft_text = await ft_el.text_content() or ""
            if "2026" in ft_text: p("Copyright shows 2026")
            else: f("Copyright year", "2026 not found")
        else: f("Footer", "Not found")
        await browser.close()
        print("")
        print("=== 9. RESPONSIVE ===")
        browser, ctx, page, _ = await fresh_page(pw)
        await page.set_viewport_size({"width": 375, "height": 812})
        await page.wait_for_timeout(500)
        await page.goto(BASE, wait_until="load", timeout=15000)
        await page.wait_for_timeout(2000)
        await page.screenshot(path=".tmp/mobile-full.png", full_page=True)
        p("Mobile screenshot captured")
        mob = await page.text_content("body") or ""
        if "Chat on WhatsApp" in mob: p("Mobile CTA: Chat on WhatsApp")
        else: f("Mobile CTA WhatsApp", "Not found")
        if "Call Now" in mob: p("Mobile CTA: Call Now")
        else: f("Mobile CTA Call", "Not found")
        nl = len(await page.query_selector_all("nav a"))
        if nl >= 4: p("Mobile nav has " + str(nl) + " links")
        else: f("Mobile nav links", "Only " + str(nl))
        if "Goa" in mob: p("Mobile hero description visible")
        else: f("Mobile hero description", "Not found")
        await page.eval_on_selector("#services", "(el) => el.scrollIntoView({block: " + Q + "center" + Q + "})")
        await page.wait_for_timeout(1500)
        try:
            cw = await page.eval_on_selector_all("#services .rounded-2xl", "(cards) => cards.length > 0 ? cards[0].getBoundingClientRect().width : 0")
            if 0 < cw < 400: p("Cards full-width: " + str(round(cw)) + "px")
            else: print("[INFO] Card width: " + str(round(cw)) + "px")
        except: pass
        # Scroll back to hero for modal test
        await page.eval_on_selector("#hero", "(el) => el.scrollIntoView()")
        await page.wait_for_timeout(300)
        # Try clicking hero Inquire Now button
        js_cta2 = "(btns) => { const b = btns.find(x => x.textContent.includes(" + Q + "Inquire Now" + Q + ")); if (b) { b.click(); return true; } return false; }"
        c = await page.eval_on_selector_all("button", js_cta2)
        await page.wait_for_timeout(500)
        dm = await page.query_selector("[role=" + Q + "dialog" + Q + "]")
        if dm: p("Modal opens on mobile"); await page.keyboard.press("Escape"); await page.wait_for_timeout(200)
        else: f("Modal on mobile", "Did not open")
        await browser.close()
        print("")
        print("=== FINAL RESULTS ===")
        if not issues: print("ALL CHECKS PASSED")
        else:
            print("ISSUES FOUND: " + str(len(issues)))
            for i in issues: print("  - " + i["label"] + ": " + i["detail"])
        return issues

if __name__ == "__main__":
    result = asyncio.run(main())
    if result: sys.exit(1)
    else: sys.exit(0)
