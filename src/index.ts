import Download, { DownloadOptions } from './DownLoad';
export default Download;
export { DownloadOptions } from './DownLoad';
export const download = async (opts: DownloadOptions) => {
    // const { url, filePath } = opts;
    const startTime = Date.now();
    await new Download(opts).start();
    const endTime = Date.now();
    console.log(`下载耗时:${(endTime - startTime) / 1000}s`);
}
