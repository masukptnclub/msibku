const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptForCredentials() {
  return new Promise((resolve) => {
    rl.question('Email: ', (email) => {
      rl.question('Password: ', (password) => {
        resolve({ email, password });
        rl.close();
      });
    });
  });
}

async function loginToMerdekaBelajar() {
  const credentials = await promptForCredentials();

  const data = JSON.stringify({
    email: credentials.email,
    password: credentials.password
  });

  const options = {
    hostname: 'api.kampusmerdeka.kemdikbud.go.id',
    path: '/user/auth/login/mbkm',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'id,fr;q=0.9,id-ID;q=0.8,en-US;q=0.7,en;q=0.6,ms;q=0.5',
      'DNT': '1',
      'Origin': 'https://kampusmerdeka.kemdikbud.go.id/',
      'Priority': 'u=1, i',
      'Referer': 'https://kampusmerdeka.kemdikbud.go.id/',
      'Sec-Ch-Ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const responseJSON = JSON.parse(responseData);

          if (res.statusCode === 200 && responseJSON.data && responseJSON.data.access_token) { 
            resolve(responseJSON.data.access_token); 
          } else {
            // Tampilkan respons asli hanya saat error
            console.error('Login response (error):', responseJSON); 

            const errorMessage = responseJSON.message || 'Unknown error';
            reject(new Error(`Login failed with status ${res.statusCode}: ${errorMessage}`));
          }
        } catch (parseError) {
          reject(new Error(`Failed to parse response: ${parseError.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function fetchApplications(token, offset = 0, limit = 5) {
  const options = {
    hostname: 'api.kampusmerdeka.kemdikbud.go.id',
    path: `/mbkm/mahasiswa/activities/my?offset=${offset}&limit=${limit}`, 
    method: 'GET',
    headers: {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'id,fr;q=0.9,id-ID;q=0.8,en-US;q=0.7,en;q=0.6,ms;q=0.5',
      'Authorization': `Bearer ${token}`,
      'DNT': '1',
      'Origin': 'https://kampusmerdeka.kemdikbud.go.id/',
      'Priority': 'u=1, i',
      'Referer': 'https://kampusmerdeka.kemdikbud.go.id/',
      'Sec-Ch-Ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const responseJSON = JSON.parse(responseData);

          if (res.statusCode === 200) {
            resolve(responseJSON);
          } else {
            // Tampilkan respons asli hanya saat error
            console.error('Fetch applications response (error):', responseJSON); 

            const errorMessage = responseJSON.message || 'Unknown error';
            reject(new Error(`Fetch applications failed with status ${res.statusCode}: ${errorMessage}`));
          }
        } catch (parseError) {
          reject(new Error(`Failed to parse response: ${parseError.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end(); 
  });
}

async function fetchActivityId(token, applicationId) {
  const options = {
    hostname: 'api.kampusmerdeka.kemdikbud.go.id',
    path: `/mbkm/mahasiswa/activities/my/${applicationId}`,
    method: 'GET',
    headers: {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'id,fr;q=0.9,id-ID;q=0.8,en-US;q=0.7,en;q=0.6,ms;q=0.5',
      'Authorization': `Bearer ${token}`,
      'DNT': '1',
      'Origin': 'https://kampusmerdeka.kemdikbud.go.id/',
      'Priority': 'u=1, i',
      'Referer': 'https://kampusmerdeka.kemdikbud.go.id/',
      'Sec-Ch-Ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const responseJSON = JSON.parse(responseData);

          if (res.statusCode === 200) {
            resolve(responseJSON.data.position_id); 
          } else {
            // Tampilkan respons asli hanya saat error
            console.error('Fetch activity ID response (error):', responseJSON); 

            const errorMessage = responseJSON.message || 'Unknown error';
            reject(new Error(`Fetch activity ID failed with status ${res.statusCode}: ${errorMessage}`));
          }
        } catch (parseError) {
          reject(new Error(`Failed to parse response: ${parseError.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end(); 
  });
}

async function fetchQuotaInformation(token, activityId) {
  const options = {
    hostname: 'api.kampusmerdeka.kemdikbud.go.id',
    path: `/magang/browse/position/${activityId}`,
    method: 'GET',
    headers: {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'id,fr;q=0.9,id-ID;q=0.8,en-US;q=0.7,en;q=0.6,ms;q=0.5',
      'Authorization': `Bearer ${token}`,
      'DNT': '1',
      'Origin': 'https://kampusmerdeka.kemdikbud.go.id/',
      'Priority': 'u=1, i',
      'Referer': 'https://kampusmerdeka.kemdikbud.go.id/',
      'Sec-Ch-Ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const responseJSON = JSON.parse(responseData);

          if (res.statusCode === 200) {
            resolve(responseJSON.data); 
          } else {
            // Tampilkan respons asli hanya saat error
            console.error('Fetch quota information response (error):', responseJSON); 

            const errorMessage = responseJSON.message || 'Unknown error';
            reject(new Error(`Fetch quota information failed with status ${res.statusCode}: ${errorMessage}`));
          }
        } catch (parseError) {
          reject(new Error(`Failed to parse response: ${parseError.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end(); 
  });
}

async function main() {
  try {
    console.log('Credit by ADS');
    const token = await loginToMerdekaBelajar();
    console.log('Login successful!');

    let allApplications = [];
    const offsets = [0, 5, 10, 15]; 

    for (const offset of offsets) {
      const response = await fetchApplications(token, offset);
      allApplications = allApplications.concat(response.data);
    }

    // Tampilkan preview data lamaran, ambil activity_id, dan tampilkan status kuota
    console.log('\nDaftar Lamaran:');
    for (const application of allApplications) {
      console.log(`- ID: ${application.id}, Nama Mitra: ${application.mitra_brand_name}, Nama Kegiatan: ${application.nama_kegiatan}`);

      try {
        const activityId = await fetchActivityId(token, application.id);
        console.log(`  Activity ID: ${activityId}`);

        const quotaInfo = await fetchQuotaInformation(token, activityId);
        const quotaStatus = quotaInfo.is_quota_full ? 'Penuh' : 'Tersedia';
        console.log(`  Status Kuota: ${quotaStatus}`);
      } catch (error) {
        console.error(`  Gagal mengambil detail lamaran: ${error.message}`);
      }

      console.log('---'); 
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error); 
  }
}

main();
