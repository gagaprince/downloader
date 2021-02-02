const fs = require('fs-extra');
import axios from 'axios';
import DownloadMoreThread from './DownloadMoreThread';

export interface DownloadOptions {
    url: string;
    filePath: string;
    retry?: number;
    onProgress?: (progress: number) => void;
    onSuccess?: () => void;
    onFailed?: (error: string) => void;
}

export default class Download {
    private retry: number = 3;
    private url: string;
    private filePath: string;
    private onFailed: (error: string) => void = (error: string) => { console.log(error); };
    public constructor(opts: DownloadOptions) {
        const { url, filePath, retry, onProgress, onSuccess, onFailed } = opts;
        this.url = url;
        this.filePath = filePath;
        this.retry = retry || this.retry;
        this.onFailed = onFailed || this.onFailed;
    }

    public async start() {
        try {
            const response = await axios({
                url: this.url,
                method: 'GET',
                responseType: 'stream',
                timeout: 5000,// responsType是stream 连接5s未响应就算超时
            });
            const inputStream = response.data;

            const length = response.headers['content-length'] || 1;
            console.log(`${this.url} 文件长度:${this.getFileSize(length)}`);
            if (length < 1024 * 1024 * 10) {//文件小于10M 单线程下载
                console.log('文件小于10M 直接单线程下载');
                await this.downloadOneThread();
            } else { // 大于10M 多线程下载
                inputStream.destroy();//先关闭当前流 开启多线程下载
                new DownloadMoreThread(this.url, this.filePath, 10, length);
            }
        } catch (e) {
            console.log(e);
            console.log("请检查网络，确定下载地址是否正确");
            this.onFailed(e.toString());
        }
    }

    private async downloadOneThread() {
        this.mkFile(this.filePath);
        const writer = fs.createWriteStream(this.filePath);
        const response = await axios({
            url: this.url,
            method: 'GET',
            responseType: 'stream',
            timeout: 5000,
        });
        const inputStream = response.data;


        console.log('开始下载....');
        inputStream.pipe(writer);

        const onError = async (resolve: any, reject: any) => {
            inputStream.destroy();
            writer.destroy();
            if (this.retry > 0) {
                this.retry--;
                fs.removeSync(this.filePath);
                try {
                    await this.downloadOneThread();
                    resolve('');
                } catch (e) {
                    reject(e);
                }
            } else {
                reject('下载失败,重试3次');
            }
        }

        return new Promise((resolve, reject) => {
            let timeoutHandle: any = setTimeout(() => {
                console.log('超过10s没有新的数据产生，下载超时');
                onError(resolve, reject);
            }, 10000);
            writer.on('data', () => {
                if (timeoutHandle) {
                    clearTimeout(timeoutHandle);
                }
                timeoutHandle = setTimeout(() => {
                    console.log('超过10s没有新的数据产生，下载超时');
                    onError(resolve, reject);
                }, 10000);
            });
            writer.on('finish', (data: any) => {
                if (timeoutHandle) {
                    clearTimeout(timeoutHandle);
                }
                console.log(`${this.url} 下载完毕.... 输出目录: ${this.filePath}`);
                resolve('');
            });
            writer.on('error', (e: any) => {
                onError(resolve, reject);
            });
        });
    }

    private getFileSize(length: number): string {
        const ksize = length / 1024;
        if (ksize < 1024) {
            return ksize.toFixed(2) + 'k';
        }
        const msize = ksize / 1024;
        if (msize < 1024) {
            return msize.toFixed(2) + 'M';
        }
        const gsize = msize / 1024;
        return gsize.toFixed(2) + 'G';
    }

    private mkFile(filePath: string) {
        const path = filePath.substr(0, filePath.lastIndexOf('/') + 1);
        fs.ensureDirSync(path);
    }

    private downloadThreads() {

    }
}