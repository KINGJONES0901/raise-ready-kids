# Raise Ready Kids — landing page

A single-file landing page for the Kids Life Skills Bundle, modeled on the structure of a high-converting printable-bundle product page (announcement timer, hero with book mockup, 50%-off launch offer, what's included, benefits table, three skill tracks, sample page, founder story, FAQ, sticky mobile CTA).

```
index.html                  the whole site — HTML, CSS and JS in one file
content/curriculum-outline.md   the 10 workbooks the page promises, page by page
content/brand-and-copy.md       naming, voice, what to change before launch
assets/                     drop your real cover images and photo here
```

## Run it locally
Open `index.html` in a browser. No build step.

## Deploy (free, 5 minutes)
Any static host works:
- **Netlify**: drag the folder onto app.netlify.com/drop
- **Vercel**: `npx vercel` in this folder
- **GitHub Pages**: push to a repo, Settings → Pages → deploy from `main`
- **Shopify**: paste the sections into a custom page template, or keep this as the landing page and link the CTA to a $0 Shopify product if you want checkout-based capture instead

Point your domain at the host once you've picked a name.

## Connect checkout
In `index.html`, find:
```js
var CHECKOUT_URL = "";
```
Set it to your product's checkout link and every Buy button points there:
- **Stripe Payment Link** (lowest fees, 5 minutes to set up, delivers a download link on the receipt page)
- **Gumroad** or **Payhip** (handle file delivery and VAT for you)
- **Shopify** product URL with Digital Downloads app

## Connect the free-sample form
```js
var FORM_ENDPOINT = "";
```
Set it to a POST endpoint that accepts JSON `{email, source}`:
- **Formspree**: `https://formspree.io/f/YOUR_ID` (then forward subscribers to your email tool)
- **Kit (ConvertKit)**, **Mailchimp**, **Beehiiv**: use their form endpoint, or swap the `fetch` call for their embed snippet

While it's empty, the form shows the success state without sending anything, so you can click through the page.

## Before launch — swap the placeholders
1. **Founder photo**: replace the `.avatar` div with `<img>` of you and your son.
2. **Book covers**: the covers are drawn in CSS so the page works with no images. Once you design real covers (Canva works), replace the `.cover` and `.mini .thumb` blocks with `<img>` tags.
3. **Privacy / Terms / Contact** links in the footer point to `#top`. Add real pages.
4. **Social proof**: the page deliberately has no review count. Add real numbers only once you have them.
5. **Delivery**: the buy box promises an instant download. Make sure your checkout tool actually delivers the PDF (Stripe Payment Links can show a link on the receipt page; Gumroad/Payhip do it automatically).
6. **Guarantee**: the page promises a 30-day no-questions refund. Honor it; it costs little on a PDF and lifts conversion.

## Design tokens
Colors and fonts live in the `:root` block at the top of the `<style>`. Change the brand there and the whole page follows. The page supports light and dark mode automatically.
