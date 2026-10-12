import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
page.setDefaultTimeout(8000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:5175');await page.evaluate(()=>document.fonts.ready);
assert.equal(await page.locator('.arctic-scene').count(),0);
assert.equal(await page.locator('.scroll-dots button').count(),2);
for(const i of [0,1,2,3,4,3,2,1,0]){
 await page.evaluate(index=>{const el=document.querySelector('.bag-story');window.scrollTo(0,window.scrollY+el.getBoundingClientRect().top+index*innerHeight)},i);
 await page.waitForFunction(index=>Number(document.querySelector('.bag-stage').dataset.step)===index,i);
 assert.equal(await page.locator('.bag-stage').getAttribute('data-color'),['Beluga','Maroon','Navy','Sand','Sand'][i]);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.screenshot({path:`verification/bag-${i}.png`});
}
await page.getByRole('button',{name:'Open bag navigation'}).click();
await page.getByRole('button',{name:'Product details',exact:true}).click();
await page.waitForFunction(()=>document.querySelector('.bag-stage').dataset.step==='4');
assert.equal(await page.locator('.bag-thumbnails button').count(),4);
for(const color of ['Maroon','Navy','Sand','Beluga']){
 await page.getByRole('button',{name:`Select ${color} bag color`}).click();
 assert.equal(await page.locator('.bag-stage').getAttribute('data-color'),color);
 const backgrounds={Beluga:'rgb(91, 91, 70)',Maroon:'rgb(101, 51, 62)',Navy:'rgb(48, 61, 81)',Sand:'rgb(167, 153, 120)'};
 assert.equal(await page.locator('.bag-color-side').evaluate(el=>getComputedStyle(el).backgroundColor),backgrounds[color]);
 assert.equal(await page.locator('.bag-white-side').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
 assert.equal(await page.getByRole('button',{name:`Select ${color} bag color`}).getAttribute('aria-pressed'),'true');
}
await page.getByRole('button',{name:/^add to bag$/i}).click();
await page.getByRole('heading',{name:'Marius backpack'}).waitFor();
await page.keyboard.press('Escape');
await page.setViewportSize({width:390,height:844});
for(const i of [0,1,2,3,4]){
 await page.evaluate(index=>{const el=document.querySelector('.bag-story');window.scrollTo(0,window.scrollY+el.getBoundingClientRect().top+index*innerHeight)},i);
 await page.waitForFunction(index=>Number(document.querySelector('.bag-stage').dataset.step)===index,i);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.screenshot({path:`verification/bag-mobile-${i}.png`});
}
await page.emulateMedia({reducedMotion:'no-preference'});
await page.getByRole('button',{name:'Open bag navigation'}).click();
await page.getByRole('button',{name:'Sand',exact:true}).click();
await page.waitForFunction(()=>document.querySelector('.bag-stage').dataset.step==='3');
assert.equal(await page.locator('.bag-color-side').evaluate(el=>getComputedStyle(el).animationName),'none');
await page.getByRole('button',{name:'View Navy backpack'}).click();
await page.waitForFunction(()=>document.querySelector('.bag-stage').dataset.step==='2');
await page.getByRole('button',{name:'View Sand backpack'}).click();
await page.waitForFunction(()=>document.querySelector('.bag-stage').dataset.step==='3');
assert.equal(await page.locator('.bag-stage').getAttribute('data-direction'),'up');
assert.ok(await page.locator('.bag-color-side').evaluate(el=>el.getAnimations().some(a=>a.animationName==='bag-slide-up')));
assert.deepEqual(errors,[]);console.log('PASS: two retained heroes, four bag colors forward/back, slide-up animation, final details, bag cart, mobile overflow.');await browser.close();
