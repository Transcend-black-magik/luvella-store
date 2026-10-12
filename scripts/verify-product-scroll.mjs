import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:5175');await page.evaluate(()=>{const el=document.querySelector('.shoes-story');scrollTo(0,scrollY+el.getBoundingClientRect().top)});
await page.getByRole('button',{name:'View Swift Red details'}).click();
for(const p of [0,.5,1,.5,0]){
 await page.locator('.shoe-product-scroll').evaluate((el,progress)=>el.scrollTop=(el.scrollHeight-el.clientHeight)*progress,p);
 await page.waitForTimeout(100);
 assert.equal(await page.locator('.shoe-product-page').getAttribute('data-progress'),p.toFixed(2));
 const bg=await page.locator('.shoe-product-background').boundingBox();assert.ok(Math.abs(bg.height-900*(1-p))<2);
 const scene=await page.locator('.shoe-product-page').boundingBox();assert.ok(Math.abs(scene.y)<1&&scene.height===900,'Product scene must stay pinned');
 if(p===.5){const info=await page.locator('.shoe-info-panel').boundingBox();assert.ok(info.y>800,'Information must not cover halfway purchase controls')}
 if(p===1){const info=await page.locator('.shoe-info-panel').boundingBox();assert.ok(Math.abs(info.y-153)<2)}
 await page.screenshot({path:`verification/product-scroll-${p}.png`});
}
await page.locator('.shoe-product-scroll').evaluate(el=>el.scrollTop=(el.scrollHeight-el.clientHeight)*.5);await page.waitForTimeout(100);
await page.getByRole('combobox',{name:'Choose sample shoe size'}).selectOption('UK 9');
await page.locator('.shoe-purchase button').click();
await page.getByRole('heading',{name:'Swift Red',exact:true}).waitFor();
assert.ok(await page.getByText('Sample item · WHT / UK 9').count());await page.keyboard.press('Escape');
await page.getByRole('button',{name:'View Swift Red details'}).click();
for(const name of ['Swift Grey','Swift Sand','Swift Navy','Swift Red']){await page.getByRole('button',{name:`Preview ${name}`}).click();assert.ok((await page.locator('#shoe-dialog-title').innerText()).includes(name))}
await page.setViewportSize({width:390,height:844});
for(const p of [.5,1]){await page.locator('.shoe-product-scroll').evaluate((el,progress)=>el.scrollTop=(el.scrollHeight-el.clientHeight)*progress,p);await page.waitForTimeout(100);await page.screenshot({path:`verification/product-mobile-${p}.png`});assert.equal(await page.locator('.shoe-product-scroll').evaluate(el=>el.scrollWidth<=el.clientWidth),true)}
await page.getByRole('button',{name:/^all shoes$/i}).click();await page.waitForTimeout(100);assert.equal(await page.locator('.shoe-product-scroll').count(),0);
assert.deepEqual(errors,[]);console.log('PASS: 0/50/100% product scroll and reverse, color previews, size/cart, mobile and return.');await browser.close();
