# http-downloader

# Install

    npm install http-downloader

# Usage

    import { download } from 'http-downloader';
    
    const mypath = path.resolve(__dirname, 'tmp/a.mp4');
    const url = 'http://vjs.zencdn.net/v/oceans.mp4';

    download({
        url, filePath: mypath, onFailed: (error: string) => {
            console.log(`失败原因！！！:${error}`);
        },
        onSuccess: () => {
            console.log('文件下载成功！');
        },
        onProgress: (progress) => {
            console.log(`进度:${Math.floor(progress * 100)}%`);
        }
    });
    
    