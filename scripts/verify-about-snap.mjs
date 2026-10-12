import {chromium} from '@playwright/test';import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto('http://localhost:5175/about');
assert.equal(await page.locator('header').count(),1);
await page.waitForTimeout(800);const header=await page.locator('.about-shared-header').boundingBox();
for(const expected of [900,1800,2700,3600,4500]){await page.mouse.wheel(0,650);await page.waitForTimeout(1000);assert.ok(Math.abs(await page.evaluate(()=>scrollY)-expected)<2);assert.deepEqual(await page.locator('.about-shared-header').boundingBox(),header)}
await page.mouse.wheel(0,-650);await page.waitForTimeout(1000);assert.ok(Math.abs(await page.evaluate(()=>scrollY)-3600)<2);
await page.getByRole('button',{name:'Open navigation',exact:true}).click();await page.getByRole('link',{name:'Home',exact:true}).last().click();await page.getByRole('button',{name:'Catalog',exact:true}).waitFor();
await page.goto('http://localhost:5175/about');await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('header').count(),1);
console.log('PASS: About snap forward/reverse, single fixed header, Home navigation and mobile.');await browser.close();
