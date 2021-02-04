import { Task } from "./task/taskUtil";
import axios from 'axios';
const fs = require('fs');

export class DownloadThreadTask extends Task {

    public retry = 10;

    public constructor(private downloadUrl: string, private start: number, private end: number, private desFile: string) {
        super();

    }

    async task(): Promise<any> {
        try {
            const ret = await this.doTask();
            return ret;
        } catch (e) {
            if (this.retry > 0) {
                this.retry--;
                return await this.task()
            }
            throw e;
        }
    }

    private async doTask() {
        const response = await axios({
            url: this.downloadUrl,
            method: 'GET',
            responseType: 'stream',
            headers: { 'Range': `bytes=${this.start}-${this.end}` }
        });
        const inputStream = response.data;
        const length = response.headers['content-length'] || 1;
        // console.log(`分片:${this.start}-${this.end}`);
        // console.log('长度:' + length);

        return new Promise((res, rej) => {
            const fd = fs.openSync(this.desFile, 'a');
            let pos = this.start;
            let timeoutHandle = setTimeout(() => {
                inputStream.destroy();
                rej("10s没有新数据读出，网络有问题终端")
            }, 10000);
            inputStream.on('data', (chunk: any) => {
                if (timeoutHandle != null) {
                    clearTimeout(timeoutHandle);
                }
                timeoutHandle = setTimeout(() => {
                    inputStream.destroy();
                    rej("10s没有新数据读出，网络有问题终端");
                }, 10000);
                // console.log(`当前属于分片:${this.start}-${this.end}`);
                fs.writeSync(fd, chunk, 0, chunk.length, pos);
                pos += chunk.length;
            });
            inputStream.on('end', () => {
                if (timeoutHandle != null) {
                    clearTimeout(timeoutHandle);
                }
                res('');
            });
            inputStream.on('error', rej);
        });
    }
}