
/**
 * バージョン情報モジュール
 */
class Version
{
    /**
     * バージョン情報を表示する
     */
    run() {
        // バージョン表示
        var json = require('../package.json');
        process.stdout.write('\n')
        console.log(`${json.name} ver ${json.version}`)
        // lib.Message(`${json.name} ver ${json.version}`, 'primary');
        process.stdout.write('\n')
    }
}
