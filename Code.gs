const SHEETS = {
  tanks: {name:'TankDetails', headers:['ID','TankName','FishAddDate','FishName','FishVariety','Status','CreatedAt','UpdatedAt']},
  breeding: {name:'BreedingDetails', headers:['ID','BreedDate','TankName','EggTankName','Status','CreatedAt','UpdatedAt']}
};

// Deploy as Web app: Execute as Me. The frontend calls this endpoint using JSONP.
function doGet(e) {
  const p = e && e.parameter ? e.parameter : {};
  const callback = p.callback;
  let result;
  try {
    setupSheets_();
    const payload = p.payload ? JSON.parse(p.payload) : {};
    switch (p.action) {
      case 'getAllData':
        result = {tanks:readSheet_('tanks'), breeding:readSheet_('breeding')};
        break;
      case 'saveTank':
        result = saveRecord_('tanks', payload);
        break;
      case 'saveBreeding':
        result = saveRecord_('breeding', payload);
        break;
      case 'deleteRecord':
        result = deleteRecord_(payload.type, payload.id);
        break;
      default:
        result = {error:'Unknown action.'};
    }
  } catch (err) {
    result = {error:String(err && err.message ? err.message : err)};
  }
  const json = JSON.stringify(result).replace(/</g,'\\u003c');
  const output = callback && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(callback)
    ? callback + '(' + json + ');'
    : '/* JSONP callback required */';
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function setupSheets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Bind this Apps Script project to the Google Spreadsheet first.');
  Object.keys(SHEETS).forEach(k => {
    const c=SHEETS[k]; let sh=ss.getSheetByName(c.name);
    if(!sh) sh=ss.insertSheet(c.name);
    if(sh.getLastRow()===0){sh.appendRow(c.headers);sh.setFrozenRows(1);sh.getRange(1,1,1,c.headers.length).setFontWeight('bold');}
  });
}
function readSheet_(key) {
  const c=SHEETS[key], sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(c.name);
  const values=sh.getDataRange().getValues(); if(values.length<2)return [];
  return values.slice(1).filter(r=>r.some(v=>v!=='')).map(r=>{
    const o={};c.headers.forEach((h,i)=>{let v=r[i];if(v instanceof Date)v=Utilities.formatDate(v,Session.getScriptTimeZone(),'yyyy-MM-dd');o[h]=v;});return o;
  });
}
function saveRecord_(key, record) {
  if(!SHEETS[key])throw new Error('Invalid record type.');
  const c=SHEETS[key], sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(c.name), now=new Date();
  const id=record.ID||Utilities.getUuid(), values=sh.getDataRange().getValues();let rowIndex=-1;
  for(let i=1;i<values.length;i++)if(String(values[i][0])===String(id)){rowIndex=i+1;break;}
  const created=rowIndex>0?values[rowIndex-1][c.headers.indexOf('CreatedAt')]:now;
  const obj=Object.assign({},record,{ID:id,CreatedAt:created,UpdatedAt:now});
  const row=c.headers.map(h=>obj[h]!==undefined?obj[h]:'');
  if(rowIndex>0)sh.getRange(rowIndex,1,1,c.headers.length).setValues([row]);else sh.appendRow(row);
  return {ok:true,id};
}
function deleteRecord_(key,id) {
  if(!SHEETS[key])throw new Error('Invalid record type.');
  const sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS[key].name),values=sh.getDataRange().getValues();
  for(let i=1;i<values.length;i++)if(String(values[i][0])===String(id)){sh.deleteRow(i+1);return {ok:true};}
  throw new Error('Record not found.');
}