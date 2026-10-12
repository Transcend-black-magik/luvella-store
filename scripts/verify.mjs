import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
fs.mkdirSync('verification',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1032,height:683},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.VERIFY_URL || 'http://localhost:5173');await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:'verification/desktop.png',fullPage:true});
await page.getByRole('button',{name:'L',exact:true}).click();
assert.equal(await page.getByRole('button',{name:'L',exact:true}).getAttribute('aria-pressed'),'true');
await page.getByRole('button',{name:'Save to wishlist',exact:true}).click();
assert.equal(await page.getByRole('button',{name:'Remove from wishlist',exact:true}).getAttribute('aria-pressed'),'true');
await page.getByRole('button',{name:'Catalog',exact:true}).click();
await page.getByRole('button',{name:'Add size L to bag'}).click();
await page.getByRole('button',{name:'Close panel'}).click();
await page.getByRole('button',{name:'Open shopping bag, 1 items'}).click();
assert.equal(await page.getByText('Sample item · Size L').count(),1);
await page.getByRole('button',{name:'Remove item 1'}).click();
assert.equal(await page.getByText('Your bag is taking a breather.').count(),1);
await page.keyboard.press('Escape');
for(const [width,height] of [[375,844],[390,844],[768,960],[1440,960],[1830,974],[1440,700],[1280,600]]){
 await page.setViewportSize({width,height});
 await page.screenshot({path:`verification/width-${width}-height-${height}.png`,fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Horizontal overflow at ${width}`);
 if(width>760){
  assert.ok((await page.locator('.canvas').boundingBox()).height<=height,`Hero exceeds viewport at ${width} × ${height}`);
  for(const selector of ['.hero-art','.editorial','.supporting','.shop-button']){
   const box=await page.locator('.canvas').locator(selector).boundingBox();
   assert.ok(box.y>=0 && box.y+box.height<=height,`${selector} outside viewport at ${width} × ${height}`);
  }
 }
}
assert.deepEqual(errors,[]);console.log('PASS: build UI, size selection, wishlist, cart add/remove, Escape, and overflow at 375/390/768/1440.');
await browser.close();
