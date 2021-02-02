import Download, { DownloadOptions } from './DownLoad';
export default Download;
export { DownloadOptions } from './DownLoad';
export const download = (opts: DownloadOptions) => {
    // const { url, filePath } = opts;
    new Download(opts).start();
}
