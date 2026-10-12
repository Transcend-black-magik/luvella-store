# Luvella

A responsive React + Vite storefront for jackets, bags, and shoes.

## Run

Run `npm install`, then `npm run dev` and open the URL Vite prints. Use `npm run build` for the production build and `npm run preview` to preview it.

## Features

Scroll-driven jacket heroes, interactive jacket colors and sizes, four backpack colors, animated bag details, and four footwear panels. Shoe product routes such as `/shoes/swift-red` support direct links, product scrolling, and animated returns. Keyboard controls and reduced-motion preferences are supported.

## Demo limitations

Some imagery is generated from design references. Color variations are interactive previews. Prices and specifications are sample details. The shopping bag and wishlist work for the current session; authentication, checkout, payments, customer support, and campaign video are not connected.

Production hosting must serve index.html for /shoes/* routes.

## Verification

With the development server on port 5175 and Chrome installed, run scripts/verify-bag.mjs, scripts/verify-shoes.mjs, scripts/verify-product-scroll.mjs, and scripts/verify-shoe-routes.mjs with Node. Screenshots are saved under verification/.About Luvella is available at /about with reveal animations, three story chapters, expandable copy and navigation. It reuses collection imagery in place of the reference studio photograph. Production hosting should also serve index.html for /about. Verify with node scripts/verify-about.mjs.
