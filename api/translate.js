const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // 设置CORS头，允许任何源访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许POST方法
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允许POST请求' });
  }

  try {
    const { appid, q, salt, sign, from, to } = req.body;
    
    // 验证必要参数
    if (!appid || !q || !salt || !sign) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    // 构造请求百度API的参数
    const params = new URLSearchParams();
    params.append('q', q);
    params.append('from', from || 'zh');
    params.append('to', to || 'en');
    params.append('appid', appid);
    params.append('salt', salt);
    params.append('sign', sign);

    // 请求百度翻译API
    const response = await fetch('https://api.fanyi.baidu.com/api/trans/vip/translate', {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // 获取API响应
    const data = await response.json();
    
    // 返回结果
    return res.status(200).json(data);
  } catch (error) {
    console.error('代理错误:', error);
    return res.status(500).json({ error: '代理服务器错误', message: error.message });
  }
};
