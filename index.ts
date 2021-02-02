import { download } from './src/index';
const path = require('path');

const mypath = path.resolve(__dirname, 'tmp/a.mp4');
console.log(mypath);

const url = 'https://s3plus.meituan.net/v1/mss_de6928b9387d43f0b5da79507447e8f2/weworkvideo/test.mp4';

download({
    url, filePath: mypath, onFailed: (error: string) => {
        console.log(`失败原因！！！:${error}`);
    }
});