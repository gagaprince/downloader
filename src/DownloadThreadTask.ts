import { Task } from "./task/taskUtil";
import axios from 'axios';
const fs = require('fs');

export class DownloadThreadTask extends Task {

    public constructor(private downloadUrl: string, private start: number, private end: number, private desFile: string) {
        super();

    }

    async task(): Promise<any> {
        const response = await axios({
            url: this.downloadUrl,
            method: 'GET',
            responseType: 'stream',
            headers: { 'Range': `bytes=${this.start}-${this.end}` }
        });
        const inputStream = response.data;
        const length = response.headers['content-length'] || 1;
        console.log(`分片:${this.start}-${this.end}`);
        console.log('长度:' + length);


        return new Promise((res, rej) => {
            const fd = fs.openSync(this.desFile, 'a');
            let pos = this.start;
            inputStream.on('data', (chunk: any) => {
                fs.writeSync(fd, chunk, 0, chunk.length, pos);
                pos += chunk.length;
                console.log('pos:' + pos);
            });
            inputStream.on('end', res);
            inputStream.on('error', rej);
        });


    }
}