import { download } from './src/index';
const path = require('path');

async function downloadFile(url: string, title: string) {
  const mypath = path.resolve(__dirname, `tmp/${title}.mp4`);
  return new Promise((res, rej) => {
    download({
      url,
      filePath: mypath,
      threadCount: 20,
      onFailed: (error: string) => {
        console.log(`失败原因！！！:${error}`);
        res('');
      },
      onSuccess: () => {
        console.log('文件下载成功！');
        res('');
      },
      onProgress: (progress) => {
        console.log(`进度:${Math.floor(progress * 100)}%`);
      },
    });
  });
}

async function main() {
  await downloadFile(
    'https://dd02.520cc.cc/ddll/mp4/7/7b7lU.mp4?sk=AoMcTJHzVojWf_8_q5jRvQ&se=1613573000',
    'HBAD-405 嬌軀白嫩的未亡人 就在丈夫的遺像前被內射 紗紗原百合[中文字幕]'
  );
  //   await downloadFile(
  //     'https://vsb02.520call.me/files/mp4/O/O5SAa.mp4?sk=3u1sAOj_H0B0amVpz7PWGQ&se=1613505771',
  //     'VOSS-096 『不要！現在動了的話……就停不下來了！』繼母憐憫童貞又總是自慰的我，同意和我股間摩擦！為了讓肉棒蹭到陰蒂而扭腰的時候肉棒一下插'
  //   );
  //   await downloadFile(
  //     'https://vsb02.520call.me/files/mp4/Y/YqqEI.mp4?sk=QNEpZ6NgkRA6aKKS9JpGjg&se=1613506081',
  //     'DOCP-180 抓住家事派遣員的弱點來追擊抽插強制中出！ 2[有碼高清中文字幕]'
  //   );
  //   await downloadFile(
  //     'https://vsb01.520call.me/files/mp4/Y/YbBbU.mp4?sk=ggqgIVtMDMoUkzXlAxcfAg&se=1613505104',
  //     'HUNTA-518 巨乳妹妹玩起素股還開插！雙腿夾腰逼我中出！[中文字幕]'
  //   );
  //   await downloadFile(
  //     'https://vsb02.520call.me/files/mp4/f/fXKk2.mp4?sk=7nZnz0XjkXHwrI3X_RqmeQ&se=1613505150',
  //     'HUNTA-529 因為太興奮了，巨乳家教幫我素股卻受不了插了進去內射了！[中文字幕]'
  //   );
}

main();
