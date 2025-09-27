/**
 * Test case configuration file
 * Contains definitions for all test cases
 */

/**
 * Define test case data
 * @returns {Array} Test case array
 */
function getTestCases() {
  return [
    {
      name: 'OKX BTC-USD Test',
      requests: [
        {
          url: 'https://www.okx.com/api/v5/public/instruments?instType=SPOT&instId=BTC-USD',
          method: 'GET',
          header: {},
          body: '',
        }
      ],
      responseResolves: [
        [
          {
            keyName: 'instType',
            parseType: 'json',
            parsePath: '$.data[0].instType'
          }
        ]
      ]
    },

    // {
    //   name: 'tiktok Test',
    //   requests: [
    //     {
    //       url: 'https://mcs-sg.tiktokv.com/v1/list',
    //       method: 'POST',
    //       header: {
    //         'sec-ch-ua-platform': '"macOS"',
    //         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    //         'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    //         'Content-Type': 'application/json; charset=UTF-8',
    //         'sec-ch-ua-mobile': '?0',
    //         'Accept': '*/*',
    //         'Origin': 'https://www.tiktok.com',
    //         'Sec-Fetch-Site': 'cross-site',
    //         'Sec-Fetch-Mode': 'cors',
    //         'Sec-Fetch-Dest': 'empty',
    //         'Referer': 'https://www.tiktok.com/',
    //         'Accept-Encoding': 'identity',
    //         'Accept-Language': 'en,zh-CN;q=0.9,zh;q=0.8'
    //       },
    //       body: JSON.stringify([
    //         {
    //           events: [
    //             {
    //               event: '__bav_page',
    //               params: '{"is_html":1,"url":"https://www.tiktok.com/","referrer":"","page_key":"https://www.tiktok.com/","refer_page_key":"","page_title":"TikTok - Make Your Day","page_manual_key":"","refer_page_manual_key":"","refer_page_title":"TikTok - Make Your Day","page_path":"/","page_host":"www.tiktok.com","is_first_time":"false","is_back":0,"page_total_width":1512,"page_total_height":771,"scroll_width":1512,"scroll_height":771,"page_start_ms":1736157993395,"event_index":1736158419929}',
    //               local_time_ms: 1736157997985,
    //               is_bav: 1,
    //               session_id: 'bc01fc24-1e44-4b88-855e-dfafd5aa17da'
    //             }
    //           ],
    //           user: {
    //             user_unique_id: '7425873819514373640',
    //             user_type: 12,
    //             user_id: '7316364221107700754',
    //             user_is_login: true,
    //             device_id: '7425873819514373640'
    //           },
    //           header: {
    //             app_id: 1988,
    //             os_name: 'mac',
    //             os_version: '10_15_7',
    //             device_model: 'Macintosh',
    //             language: 'en',
    //             region: 'SG',
    //             platform: 'web',
    //             sdk_version: '5.3.3_oversea',
    //             sdk_lib: 'js',
    //             timezone: 8,
    //             tz_offset: -28800,
    //             resolution: '1512x982',
    //             browser: 'Chrome',
    //             browser_version: '131.0.0.0',
    //             referrer: '',
    //             referrer_host: '',
    //             width: 1512,
    //             height: 982,
    //             screen_width: 1512,
    //             screen_height: 982,
    //             tracer_data: '{"$utm_from_url":1}',
    //             custom: '{"session_id":"74258738195143736401736157997914","webid_created_time":"1728970991","app_language":"en","page_name":"homepage_hot","device":"pc","launch_mode":"direct","device_memory":8,"traffic_type":"no_referrer","source":"","referer_url":"direct","browserName":"google","hevcSupported":1,"cpu_core":8}'
    //           },
    //           local_time: 1736157997,
    //           verbose: 1
    //         }
    //       ]),
    //     }
    //   ],

    //   responseResolves: [
    //     [
    //       {
    //         keyName: 'sc',
    //         parseType: 'json',
    //         parsePath: '$.sc'
    //       }
    //     ]
    //   ]
    // },
    // {
    //   name: 'OKX SOL-USD Test',
    //   requests: [
    //     {
    //       url: 'https://www.okx.com/api/v5/public/instruments?instType=SPOT&instId=SOL-USD',
    //       method: 'GET',
    //       header: {},
    //       body: '',
    //     }
    //   ],
    //   responseResolves: [
    //     [
    //       {
    //         keyName: 'instType',
    //         parseType: 'json',
    //         parsePath: '$.data[0].instType'
    //       }
    //     ]
    //   ]
    // }
  ];
}

module.exports = {
  getTestCases
};
