/** シート情報取得 */
const SHEET = SpreadsheetApp.getActiveSpreadsheet();

/** @string シート情報管理シート名 */
const SHEET_INFO_MANAGEMENT_NAME = "sheetInfo";
/** @string 通知管理シート名 */
const SHEET_MASTER = SHEET.getSheetByName("master");

// discord側で作成したボットのウェブフックURL
const discordWebHookURL = "自身のDISCORD BOTのURLに書き換える";

const EMPTY = 0;

/**
 * 通知する
 */
function notify(){
  //通知種類を取得
  let notificationType = SHEET_MASTER.getRange("A2").getValue();

  //通知種類に紐づくシートを取ってくる
  let notificationSheet = SHEET.getSheetByName(GetNotificationSheetType(notificationType));

  //今日の日付を取得 時刻を0時にする 日付比較の際は経過ミリ秒数で比較する
  // const today = new Date().setHours(0,0,0,0).getTime();
  const today = new Date();

  //該当するリストを
  let nameList = GetBirthdayNameList(notificationSheet, today);

  //送信
  if(nameList.length !== EMPTY){
    nameList.forEach(function(name){
      sendMessage(discordWebHookURL, name);
    })
  }
}

function sendMessage(webhookUrl, name){
    // 投稿するチャット内容と設定
  const message = {
    "content": '今日は' + name + 'さんの誕生日です！', // チャット本文
    "tts": false  // ロボットによる読み上げ機能を無効化
  }

  const param = {
    "method": "POST",
    "headers": { 'Content-type': "application/json" },
    "payload": JSON.stringify(message)
  }

  UrlFetchApp.fetch(webhookUrl, param);
}

/**
 * シート情報の取得
 */
const GetSheetInfo= () =>{
  //最後の行を取得
  const lastRow = SHEET.getLastRow();
}


/**
 * 通知種類に紐づくシートをとってくる
 */
const GetNotificationSheetType = (notificationType) => {
  switch(notificationType){
    case "誕生日":
     return "birthday";
  }
}

/**
 * 今日誕生日の人を検索し、一覧で返す
 * @param object birthdaySheet
 * @param date today
 */
const GetBirthdayNameList = (birthdaySheet, today) =>{
  //名前列の最終行を取得
  var nameLastLow = birthdaySheet.getLastRow();

  //範囲取得
  var range = birthdaySheet.getRange('A2:B' + nameLastLow);
  var data = range.getValues();

  var todayFormatted = Utilities.formatDate(today,Session.getScriptTimeZone(), 'MM-dd');

  
  //返却配列を作成
  var nameList = [];

  //取得データから今日誕生日の人を探す
  for(var i = 0; i<data.length; i++){
      var rowDate = new Date(data[i][1]);
      var rowDateFormatted = Utilities.formatDate(rowDate, Session.getScriptTimeZone(), 'MM-dd');

      //今日誕生日なら配列に名前を格納
      if(todayFormatted === rowDateFormatted){
        nameList.push(data[i][0]);
        console.log('今日は' + data[i][0] + 'さんの誕生日です！');
      }
  }

  return nameList;
}
