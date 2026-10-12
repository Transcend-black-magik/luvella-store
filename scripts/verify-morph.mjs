import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
await page.goto('http://localhost:5175');
for(const step of [3,4,3]){
 await page.evaluate(i=>{const el=document.querySelector('.bag-story');window.scrollTo(0,window.scrollY+el.getBoundingClientRect().top+i*innerHeight)},step);
 await page.waitForFunction(i=>Number(document.querySelector('.bag-stage').dataset.step)===i,step);
 if(step===4){
  assert.equal(await page.locator('.bag-stage').getAttribute('data-motion'),'morph');
  assert.equal(await page.locator('.bag-stage').getAttribute('data-color'),'Sand');
  assert.equal(await page.locator('.bag-color-side').evaluate(el=>getComputedStyle(el).animationName),'none');
  await page.waitForTimeout(1100);
  assert.equal(await page.locator('.bag-white-side').evaluate(el=>getComputedStyle(el).clipPath),'polygon(0px 0px, 90% 0px, 63% 100%, 0px 100%)');
 }
}
assert.equal(await page.locator('.bag-stage').getAttribute('data-motion'),'morph');
assert.equal(await page.locator('.bag-color-side').evaluate(el=>getComputedStyle(el).animationName),'none');
console.log('PASS: final Sand panel morphs to angled detail shape and reverses without vertical slide.');await browser.close();
