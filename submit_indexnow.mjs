import fs from 'fs';
import https from 'https';

async function submitIndexNow() {
  console.log('🚀 IndexNow Sitemap Submission Script');
  console.log('======================================\n');

  // Read sitemap.xml
  let sitemapContent;
  try {
    sitemapContent = fs.readFileSync('./sitemap.xml', 'utf8');
  } catch (e) {
    console.error('❌ Error reading sitemap.xml:', e.message);
    return;
  }

  // Extract all <loc> URLs
  const urlRegex = /<loc>(https:\/\/pombagiras\.com\/[^<]+)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = urlRegex.exec(sitemapContent)) !== null) {
    urls.push(match[1]);
  }

  console.log(`📋 Found ${urls.length} URLs in sitemap.xml`);

  if (urls.length === 0) {
    console.warn('⚠️ No URLs found to submit.');
    return;
  }

  const payload = {
    host: 'pombagiras.com',
    key: 'alexiamelusine2026indexnow',
    keyLocation: 'https://pombagiras.com/alexiamelusine2026indexnow.txt',
    urlList: urls
  };

  const payloadString = JSON.stringify(payload);

  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payloadString)
    }
  };

  console.log('📤 Submitting URLs to IndexNow API...');
  
  const req = https.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => {
      responseBody += chunk;
    });

    res.on('end', () => {
      console.log(`\n======================================`);
      console.log(`📊 IndexNow Response Code: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log('✅ Success! Search engines supporting IndexNow (Bing, Yandex, etc.) will prioritize crawling these URLs.');
      } else if (res.statusCode === 202) {
        console.log('✅ Accepted. Search engines will process the URLs.');
      } else {
        console.error(`❌ Failed with code ${res.statusCode}.`);
        console.error('Response:', responseBody);
      }
      console.log(`======================================\n`);
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Request Error: ${e.message}`);
  });

  req.write(payloadString);
  req.end();
}

submitIndexNow().catch(console.error);
