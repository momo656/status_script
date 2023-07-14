const axios = require('axios');
const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./client_secret.json");
const doc = new GoogleSpreadsheet(
    "1TNjwIp5mRfCjcdZwn5aLi51d3VLjqFadu2hfdBF2buQ"
  );
  const read = async ()=> {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  let rows = await sheet.getRows();
  for (let row of rows){
    
    axios.get(`https://breadfast.freshservice.com/api/_/tickets/${(row['FreshService Ticket URL'].split('/').slice(-1)[0]).split("?")[0]}?include=requester%2Cstats%2Cphone%2Cfeedback%2Cticket_status`)
  .then(async function  (response) {
    // handle success
    row.status = response.data.ticket.requester_status_name; // update a value
    await row.save(); 
    console.log(response.data.ticket.requester_status_name);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });

  }
  
  }
  read();

// // Make a request for a user with a given ID
axios.defaults.headers.common['Cookie'] = "_BEAMER_USER_ID_bxOQALFw21023=4700fd81-d4c5-4b49-9e45-35bd469269f3; _BEAMER_FIRST_VISIT_bxOQALFw21023=2023-07-09T11:59:38.254Z; ajs_group_id=null; ajs_user_id=%2220001445087%22; ajs_anonymous_id=%22e94868f2-d8b7-4d21-9dbc-c3ccd3bbb821%22; _hp2_ses_props.1080212440=%7B%22r%22%3A%22https%3A%2F%2Faccounts.google.com%2F%22%2C%22ts%22%3A1689093420994%2C%22d%22%3A%22breadfast.freshservice.com%22%2C%22h%22%3A%22%2Fa%2Fdashboard%2Fdefault%22%7D; _BEAMER_FILTER_BY_URL_bxOQALFw21023=true; _x_m=x_l; _x_d=x_3; helpdesk_node_session=87876727aa756272c821f581c1adf09910fccf51554912dc364be432340b8751cd702581939c341345b5e0ba42a58af183c7defcda25d6c199e165a57b079e24; user_credentials=BAhJIgGNNDkxOWJiNzJhMzNmMzg4ZDY4OGRjMThiZjFjMWQ2MmM1NjgxMTQwYWVmODYyYzZhZWM3MGIwM2E1NGI3ZDJlZmM5NjI0NWU1OGE5ZWJjMjE3NWFjZTRkNmU2NDEzZDBjODUyYTA3MDc4NmZhYzkwN2U0MzQxOGE3Y2NiMTdhMTE6OjIwMDAxNDQ1MDg3BjoGRVQ%3D--f7ecd3cbae24826b4155f2c56e24fbf25ea873ae; helpdesk_url=breadfast.freshservice.com; fw-session-id=2cf18787f5bff1c6b1dfca630f48538ce8b4867e1e4a481ff0f3ffed63749fc2dbd23baecbce79708d912cd1e81852c1eee3dd0ed27c4e319cf9d94326e0e8fa4849852173cddc4c32d729ed122e9546d3e86154e834cfc633a88e1b59b8219054d6b0011071d06827252dc92aa80340; _hp2_props.1080212440=%7B%22account_id%22%3A%22474961%22%2C%22account_state%22%3A%22prod%22%2C%22account_plan%22%3A%22growth%22%2C%22workspace_id%22%3Anull%2C%22workspace_type%22%3Anull%2C%22workspace_state%22%3Anull%2C%22screenSize%22%3A%22718x608%22%2C%22screenResolution%22%3A%221436x1216%22%2C%22playGodPrivileges%22%3A%22false%22%2C%22workloadPrivilege%22%3A%22None%22%7D; _hp2_id.1080212440=%7B%22userId%22%3A%224735263206593038%22%2C%22pageviewId%22%3A%226521569450081927%22%2C%22sessionId%22%3A%225680407760431381%22%2C%22identity%22%3A%2220001445087%22%2C%22trackerVersion%22%3A%224.0%22%2C%22identityField%22%3Anull%2C%22isIdentified%22%3A1%7D; _itildesk_session=ZW9wTGpGY3Z0SmVGbCtBaW5vOFRERDIwd0ZwakdRK0IvV1JiNWdHZkRXSHpyUnRPNU40enVndE1YMTVVaWFzL3NkZFI0VVkxR3JxQnB1TVJsMDc5M2JCcWRwTXJLMklEcmpKWFg1WFJoSlZiZzJuZDBlOHRsc2tEZmFwdUZHSjNKdEZ2Yi9TajY3WG1KM0VaYnlPVkNLdC9GaUFtUzZjR1ZhRm51RlljWndNaGNDU3ZnMExRMVVFTmczTUdrZU5qNUtZUmp1aGFuU205SXFLdkVobE1UUW4rQW9aaTgzTVdPT0RZK01GMnh4M0tHbGpQdlhaeEd0dHVlL2NuQTJYSDZJMWRiU1J5YnNhSWlLSmpWRmcrbFFEUW9hT2hDWFZRYXVxSVBEdGg4MW1kcVgva0tyZTg0WXRHR1NEb1hzYUdnaDMrOWlXMnhrV25jaVo0NHhMakVuNWY3QzZER3BsV3EyN0RTVEFUSUwzcExTZk5JeVpFNFBBR1RqZUorR29Ic3VzZFlPcDNEQ3IwdmRXTWhKVnVGaU1JanpFeXRUKyt1MWlqY0t0Yld5ZkNZSFJLNWgrVFEzTDdjd21iblI5cFRLTmVCMHVadjFnd1IrTWFBWno5OVp1SEJBeFoySnBpSm51VmtxcFBjWmdYQTh2V0VGUCtkQVBvUStUeHZRb21JVTJEbS9DLzU2MG5yVTFXZ29ibjU0UnB3MnF0YVhnblNXREtJUW03ZEVGTmVQZWtGVWU3MzRYUXMrcnhKU3R6QkVlKzZLdU56cDNwdlBnY1dhVEdtT3FuanBSbUtjb3hNQ0JHemNZQ1JzSE5LbzRTL0U3WU9KaUNJaStjVGtPejhMQ0lBWnRQa21ENlNGeGpzSkNLZWNQM2Y5Uis5SGFqWXpsK2xzY2hld2lVTXJ1VVBiWjloVDlzdkpaNk9VOGg2VkU2VjhBN25OeWJGazVPTFU4dVZvQUk0S0NIUmtBQjgreTQzMVBydDVUMGRCeWUya0xJeURJS3lEcFNVUFlQSm52ZGwyaHVGdmRmK1JYRHAvZmdyak50SFV5THFTRWMrMFFFSGlkZm1paTRraUNyNzFyK0tFYUhlZGw0VERucWRiYzFQQ290eHZvWitkSFRpa1RZZlpXdXk3dUFYQjdNVVNKV1RhK0Jha3J5RWtjS01jTlVQeTNCMWtWTFlnT0RTd1B6ci9oRk9JSElQTGFGMC9PTWFodjhIZ05RZlVEZ240M3B2QVk3Z25yakVKNE52bW9uVU9FSmExRTROUndmN29pUE90R2NlZ3pEbjMxM1B4aG9xVmhLcmc1bzN2U1ZQNGErSnBWMTJGSjg5TnBVMEdoNzhWdjlPSTNUMVlPMENlcGp2NFd4SGhNL1N0b3hBSnpaUE11NHViYXh1a2Y2OGdFYmdwUFdaVlE9LS1VNWRNZjIxdGJxYXdTblBxWk9ZbVV3PT0%3D--124141c574ba982322ac1215ac34ee3e8f0000f8";
