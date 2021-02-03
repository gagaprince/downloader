import { download } from './src/index';
const path = require('path');

const mypath = path.resolve(__dirname, 'tmp/a.mp4');
console.log(mypath);

const url = 'http://vjs.zencdn.net/v/oceans.mp4';

download({
    url, filePath: mypath, onFailed: (error: string) => {
        console.log(`失败原因！！！:${error}`);
    }
});