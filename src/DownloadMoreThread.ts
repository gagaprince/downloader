import { TaskPool, Task } from "./task/taskUtil";
import { DownloadThreadTask } from "./DownloadThreadTask";

const fse = require('fs-extra');

export interface DownloadThreadOption {
    downloadUrl: string;
    desFile: string;
    threadCount: number;
    length: number;
    onProgress?: (progress: number) => void;
}

export default class DownloadMoreThread {
    private downloadUrl: string; //目标地址
    private pool: TaskPool | null;
    private desFile: string; //目标地址
    private length: number; // 要下载的文件长度
    private step: number = 1024 * 1024; //每个分片 1M

    public constructor(opts: DownloadThreadOption) {
        const { downloadUrl, desFile, threadCount, length, onProgress } = opts;
        this.downloadUrl = downloadUrl;
        this.desFile = desFile;
        this.length = length;
        this.pool = new TaskPool(threadCount);
        this.pool.onProgress((progress: number) => {
            if (onProgress) {
                onProgress(progress);
            }
        });
    }
    public async start() {
        await this.initTask();
    }

    stop() {
        this.pool?.stop();
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
        fse.removeSync(this.desFile);
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
            this.pool?.addTask(new DownloadThreadTask(this.downloadUrl, start, end, this.desFile));
            degree = end;
        }
        return new Promise((res, rej) => {
            this.pool?.addFinishListener((tasks: Task[]) => {
                const isFailed = tasks.some((task) => {
                    return !task.taskIsSuccess;
                });
                isFailed ? rej("部分分片下载失败，请查看网络情况！") : res('');
            });
        });
    }
    private finish() {
        this.pool = null;
    }
}