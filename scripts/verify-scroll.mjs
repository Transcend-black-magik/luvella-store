import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.VERIFY_URL||'http://localhost:5175');await page.evaluate(()=>document.fonts.ready);
const nav=await page.locator('.navigation').boundingBox();
assert.equal(await page.locator('.scroll-dots button').count(),2);
for(const i of [0,1,0,1]){
 await page.evaluate(index=>window.scrollTo(0,index*innerHeight),i);
 await page.waitForFunction(index=>document.querySelector('.canvas').classList.contains(`slide-${index}`),i);
 assert.equal(await page.locator('.scroll-dots button[aria-current="step"]').getAttribute('aria-label'),['Show slide 1: Winter protection','Show slide 2: Luvella raincoat','Show slide 3: Arctic cream puffer','Show slide 4: Winter campaign'][i]);
 assert.deepEqual(await page.locator('.navigation').boundingBox(),nav);
 await page.screenshot({path:`verification/scroll-slide-${i+1}.png`});
}
await page.getByRole('button',{name:'Show slide 2: Luvella raincoat'}).click();
await page.waitForFunction(()=>document.querySelector('.canvas').classList.contains('slide-1'));
await page.getByRole('button',{name:'Explore this piece'}).click();
await page.getByRole('heading',{name:'The Luvella raincoat'}).waitFor();await page.keyboard.press('Escape');
assert.equal(await page.locator('.next-section').count(),0);
await page.setViewportSize({width:390,height:844});
for(let i=0;i<2;i++){
 await page.evaluate(index=>window.scrollTo(0,index*innerHeight),i);
 await page.waitForFunction(index=>document.querySelector('.canvas').classList.contains(`slide-${index}`),i);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.screenshot({path:`verification/scroll-mobile-${i+1}.png`});
}
await page.emulateMedia({reducedMotion:'no-preference'});
for(const i of [0,1,0]){
 await page.evaluate(index=>window.scrollTo(0,index*innerHeight),i);
 await page.waitForFunction(index=>document.querySelector('.canvas').classList.contains(`slide-${index}`),i);
 const animated=await page.locator('.canvas').evaluate(el=>el.getAnimations({subtree:true}).length);
 assert.ok(animated>15,`Missing entrance animations on slide ${i}`);
 await page.waitForTimeout(1500);
}
assert.deepEqual(errors,[]);console.log('PASS: two scroll states in both directions, replaying animations, active dots, persistent navigation, raincoat panel, removed final section and mobile overflow.');await browser.close();
