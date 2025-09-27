/**
 * 测试用例配置文件
 * 包含所有测试用例的定义
 */

/**
 * 定义测试用例数据
 * @returns {Array} 测试用例数组
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
    //   name: 'OKX ETH-USD Test',
    //   requests: [
    //     {
    //       url: 'https://www.okx.com/api/v5/public/instruments?instType=SPOT&instId=ETH-USD',
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
