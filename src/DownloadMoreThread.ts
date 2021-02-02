import { TaskPool } from "./task/taskUtil";
import { DownloadThreadTask } from "./DownloadThreadTask";

const fse = require('fs-extra');
export default class DownloadMoreThread {
    private downloadUrl: string; //目标地址
    private pool: TaskPool;
    private desFile: string; //目标地址
    private length: number; // 要下载的文件长度
    private step: number = 1024 * 1024; //每个分片 1M

    public constructor(downloadUrl: string, desFile: string, threadCount: number, length: number) {
        this.downloadUrl = downloadUrl;
        this.desFile = desFile;
        this.length = length;
        this.pool = new TaskPool(threadCount);
        this.initTask();
    }

    private async initTask() {
        // 创建一个文件
        this.createFile();
        // 开始下载任务
        await this.beginTask();
        // 下载完毕后将文件名改写
        this.finish();
    }

    private createFile() {
        fse.ensureFileSync(this.desFile);
    }

    private async beginTask() {
        let degree = 0;
        while (degree < this.length) {
            let start = degree;
            let end = degree + this.step;
            if (end >= this.length) {
                end = this.length;
            }
            this.pool.addTask(new DownloadThreadTask(this.downloadUrl, start, end, this.desFile));
            degree = end;
        }
        return new Promise((res) => {
            this.pool.addFinishListener(res);
        });
    }
    private finish() { }
}