import { download } from './src/index';
import DownLoad from './src/index';
const path = require('path');

const mypath = path.resolve(__dirname, 'tmp/a.mp4');
console.log(mypath);

const url = 'http://vjs.zencdn.net/v/oceans.mp4';

const task = new DownLoad({
    url, filePath: mypath,
    type: 2,
    onFailed: (error: string) => {
        console.log(`失败原因！！！:${error}`);
    },
    onSuccess: () => {
        console.log('文件下载成功！');
    },
    onProgress: (progress) => {
        console.log(`进度:${Math.floor(progress * 100)}%`);
    }
});
task.start();
setTimeout(() => {
    console.log('1分钟后停止下载');
    task.stop()
}, 10000);

// const fs = require('fs-extra');

// const fd = fs.openSync('./tmp/a.mp4', 'a');

// var buffer = new Buffer('加这么一段文字！！！！！');
// console.log(buffer.length);
// console.log(buffer)

// fs.writeSync(fd, buffer, 0, buffer.length, 100001);