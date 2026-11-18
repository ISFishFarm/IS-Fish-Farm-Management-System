# IS Fish Farm Monitoring System

Google Apps Script web app + Google Sheets database.

## Included files
- `Code.gs` — server-side Apps Script and Google Sheets CRUD functions.
- `Index.html` — responsive web application UI.

## Setup
1. Create a new Google Spreadsheet. This spreadsheet will be the database.
2. In the spreadsheet, open **Extensions → Apps Script**.
3. Replace the contents of `Code.gs` with the supplied `Code.gs`.
4. Click **+ → HTML**, name the file exactly `Index`, and paste the contents of `Index.html`.
5. Save the project.
6. In Apps Script, select `setupSheets` and click **Run** once. Approve the requested Google Sheets permissions. This creates:
   - `TankDetails`
   - `BreedingDetails`
7. Select **Deploy → New deployment**.
8. Choose **Web app**.
9. Set **Execute as** to **Me**.
10. Set **Who has access** to the intended users (for example, anyone with the link, if appropriate for your account and data).
11. Click **Deploy**, authorize if prompted, and open the Web app URL.

## Data and calculations
- Tank and breeding records are saved to the linked spreadsheet.
- Tank and breeding forms support Create, Read/View, Update and Delete.
- Breeding Tank Name options are loaded from tanks whose status is `Available`.
- Days are calculated in the browser as `Today - Breed Date` and update whenever the page is loaded/refreshed.
- Fish varieties follow the supplied PDF: Angel Fish → Black Lace / Tri Color; Carp Fish → Veiltail.

## Important
- Use the spreadsheet that is bound to this Apps Script project.
- Do not rename the sheet tabs or header columns created by `setupSheets`.
- If you change the Apps Script code after deployment, use **Deploy → Manage deployments → Edit → New version → Deploy** to publish the changes.
- Anyone granted access to the web app may be able to view or change farm records. Choose access settings carefully.
