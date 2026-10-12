import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
page.setDefaultTimeout(8000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:5175');await page.evaluate(()=>document.fonts.ready);
await page.evaluate(()=>{const el=document.querySelector('.shoes-story');scrollTo(0,scrollY+el.getBoundingClientRect().top)});
await page.waitForFunction(()=>document.querySelector('.shoes-stage').classList.contains('shoes-entered'));
assert.equal(await page.locator('.shoe-panel').count(),4);
await page.screenshot({path:'verification/shoes-desktop.png'});
await page.locator('.shoe-panel').nth(3).hover();assert.ok(await page.locator('.shoe-panel').nth(3).evaluate(el=>el.classList.contains('shoe-active')));
await page.getByRole('button',{name:'View Swift Navy details'}).click();
await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');
await page.locator('.shoe-panel').nth(1).hover();await page.waitForTimeout(200);await page.getByRole('button',{name:'View Swift Red details'}).click();
await page.screenshot({path:'verification/shoe-dialog-debug.png'});await page.getByRole('button',{name:'Add sample to bag'}).click();
await page.getByRole('heading',{name:'Swift Red',exact:true}).waitFor();await page.keyboard.press('Escape');
for(const [index,name] of ['Swift Grey','Swift Red','Swift Sand','Swift Navy'].entries()){
 await page.locator('.shoe-panel').nth(index).hover();
 await page.waitForTimeout(100);
 await page.locator('.shoe-panel').nth(index).click();
 await page.getByRole('dialog',{name:new RegExp(name)}).waitFor();
 assert.equal(await page.locator('.shoe-product-art').count(),1);
 await page.screenshot({path:`verification/shoe-product-${index}.png`});
 await page.getByRole('button',{name:'Close shoe details'}).click();
}
await page.emulateMedia({reducedMotion:'no-preference'});
assert.equal(await page.locator('.shoe-plus').count(),0);
await page.mouse.move(-20,-20);
await page.evaluate(()=>document.activeElement?.blur());
await page.waitForTimeout(1000);
const widths=await page.locator('.shoe-panel').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().width));
assert.ok(Math.max(...widths)-Math.min(...widths)<1,'Panels must have equal idle widths');
assert.equal(await page.locator('.shoe-panel-copy').nth(1).evaluate(el=>getComputedStyle(el).opacity),'0');
await page.locator('.shoe-panel').nth(1).hover();await page.waitForTimeout(900);
assert.equal(await page.locator('.shoe-panel-copy').nth(1).evaluate(el=>getComputedStyle(el).opacity),'1');
assert.ok((await page.locator('.shoe-panel').nth(1).evaluate(el=>getComputedStyle(el).cursor)).includes('data:image/svg+xml'));
await page.locator('.shoe-panel').nth(1).click();await page.waitForTimeout(1200);
await page.getByRole('button',{name:/^all shoes$/i}).click();
assert.equal(await page.locator('.shoe-product-page').evaluate(el=>getComputedStyle(el).animationName),'shoe-page-return');
assert.equal(await page.locator('.shoe-selected .shoe-art').evaluate(el=>getComputedStyle(el).visibility),'hidden');
await page.waitForTimeout(400);
assert.equal(await page.locator('.shoe-product-art').evaluate(el=>getComputedStyle(el).opacity),'1');
assert.equal(await page.locator('.shoe-product-copy').evaluate(el=>getComputedStyle(el).visibility),'hidden');
await page.screenshot({path:'verification/shoe-return-midpoint.png'});
await page.waitForTimeout(1000);
assert.equal(await page.locator('.shoe-product-page').count(),0);
await page.evaluate(()=>document.documentElement.style.scrollSnapType='none');
for(const progress of [.25,.5,.75,1,.5]){
 await page.evaluate(p=>{const el=document.querySelector('.shoes-story');scrollTo(0,scrollY+el.getBoundingClientRect().top-(1-p)*innerHeight)},progress);
 await page.waitForTimeout(100);
 const box=await page.locator('.shoes-stage').boundingBox();assert.ok(Math.abs(box.y)<2);const viewportWidth=await page.locator('.shoes-story').evaluate(el=>el.clientWidth);assert.ok(Math.abs(box.x-viewportWidth*(1-progress))<2);const bagBox=await page.locator('.bag-stage').boundingBox();assert.ok(Math.abs(bagBox.x+viewportWidth*progress)<2);assert.ok(Math.abs(bagBox.x+bagBox.width-box.x)<2,JSON.stringify({progress,viewportWidth,bagBox,box}));if(progress===.5){assert.ok(Math.abs((await page.locator('.bag-stage').boundingBox()).y)<2);await page.screenshot({path:'verification/shoes-half-split.png'})}
}
await page.setViewportSize({width:390,height:844});
await page.evaluate(()=>{const el=document.querySelector('.shoes-story');scrollTo(0,scrollY+el.getBoundingClientRect().top)});
await page.waitForTimeout(1300);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
await page.screenshot({path:'verification/shoes-mobile.png'});
assert.deepEqual(errors,[]);console.log('PASS: right-entry/reverse scroll, four panels, hover, details/Escape, cart, mobile overflow.');await browser.close();
