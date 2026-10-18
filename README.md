Traksta: student finance tracker

```Video for walk through: https://youtu.be/Wxl0KYd4WH0

Traksta lets a student log purchases, search them with regular expressions, and stay under a spending cap. It is plain HTML, CSS and JavaScript with no frameworks. There is no server or account: records and settings are saved in the browser with `localStorage`.

Contact: GitHub [gg-prince](https://github.com/gg-prince/Student_finance_tracker) · Email: g.prince@alustudent.com

Pages and what they do:

| Page | What it does |
|---|---|
| index.html (Home) | Dashboard: budget cap meter, record count, total spent, top category, last-7-days total and bar chart, 5 newest records |
| records.html | Table of all records. Regex search with one-click shortcuts, sort by date or amount, edit and delete (delete asks first) |
| Add.html | Add a record. Every field is checked as you type |
| settings.html | Base currency plus two others with manual rates, spending cap, categories, export / import JSON, delete all |
| about.html | Purpose, how to use it, search tips, contact |

The currency dropdown in the navbar (filled by currency.js) works on every page. Amounts are always saved in the base currency; the dropdown only changes how they are displayed.

Regex rules

| Where | Rule | Pattern |
|---|---|---|
| Add: description | No space at the start or end | `/^\S(?:.*\S)?$/` |
| Add: description | **Back-reference:** same word twice in a row | `/\b(\w+)\s+\1\b/i` |
| Add: amount | Up to 2 decimals, no sign or leading zeros | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` |
| Add: date | `YYYY-MM-DD` (code also rejects impossible days like 2025-02-30) | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` |
| Add / Settings: category | Letters, single spaces or hyphens | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` |
| Settings: currency code | 3 capital letters | `/^[A-Z]{3}$/` |
| Settings: exchange rate | **Lookahead:** above zero (blocks 0, 0.0, 000) | `/^(?!0+(?:\.0+)?$)\d+(?:\.\d{1,6})?$/` |
| Settings: cap | Same as the amount rule, or blank for no cap | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` |

Search shortcuts on Records: \.\d{2}\b (cents present), (coffee|tea), \b(\w+)\s+\1\b (repeated word). Search is case-insensitive. An invalid pattern shows an error instead of breaking the page.

Data

Two localStorage keys: records and settings. A record looks like:

json
{ "id": "rec_0001", "description": "Lunch at cafeteria", "amount": 12.5, "category": "Food",
  "date": "2025-09-25", "createdAt": "2025-09-25T10:30:00.000Z", "updatedAt": "2025-09-25T10:30:00.000Z", "active": true }


Delete sets active: false instead of removing the record, so new ids never reuse an old one. Export (Settings) downloads settings plus active records as JSON. Import checks every record first (types, rules above, unique ids) and loads nothing if any record is invalid.

Keyboard and accessibility

- Keyboard: the pages use the browser's standard behaviour. `Tab` / `Shift+Tab` move between controls, `Enter` or `Space` activates buttons and links, `Enter` submits a form, arrow keys change dropdown options. There are no custom shortcuts.
- Forms: labels are linked to their inputs. On Add, hints and errors are linked with `aria-describedby` and invalid fields get `aria-invalid`. Errors are written as text, not just a red border.
- Cap messages: the dashboard has two screen-reader regions. Under the cap is announced politely; over the cap is announced assertively. The bar chart has a text version ("Monday, Oct 12: $20.00") for screen readers.
- Not colour alone: the cap says "left" or "over" in words.
- Motion: the dashboard bar animation is switched off for people who prefer reduced motion.
- Known gaps: there is no skip link, each page has two `<h1>` elements (logo and page title), and the Records page has not had a screen-reader check.

Testing (manual checklist)

1. Add: submit empty (errors appear and focus jumps to the first field). Then try lead, the the book, 12.345, 012, 2025-02-30, Food2. Each should show a message.
2. Records: search (coffee|tea), \.\d{2}\b, then ( (error shown, all rows stay). Sort by amount. Edit a row and save. Delete a row and confirm.
3. Settings: set a cap of 100 and save. Try a rate of 0, a code of us, and two identical codes (all rejected).
4. Dashboard: with the cap lower than your total the meter turns red and says over. Switch the navbar currency and check the numbers change everywhere.
5. Import: import a file with a bad date and confirm nothing changes. Export, then import that same file and confirm it loads.
6. Persistence: reload the page. Records and settings should still be there.
7. Responsive: narrow the window below 525px and check the mobile menu opens and closes.

Files


index.html  dashboard.css     records.html  records.css     add.html  add.css  about.html about.css  seed.json  currency.js
settings.html  settings.css   about.html  about.css         base.css (navbar)
currency.js (shared currency dropdown)     seed.json (sample records)
```
