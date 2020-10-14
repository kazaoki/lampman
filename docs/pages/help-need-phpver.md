###### 😵 困ったとき

# 必要なPHPバージョンが一覧にない
----------------------------------------------------------------------

- Lampman で設定できるPHPバージョン一覧  
  https://hub.docker.com/r/kazaoki/phpenv/tags

対応バージョンは気まぐれに（私が）増やすので、しばらく待つか、[こちらからIssue投げていただければ](https://github.com/kazaoki/anyenv-bins/issues)気づいたときに追加します。
ただし、古いバージョン（5.3以下）はちゃんとビルドできない可能性が非常に高いので、期待しないほうがいいかも・・。


- 対応できるかもしれないPHPバージョン一覧  
  https://github.com/php-build/php-build/tree/master/share/php-build/definitions


尚、Dockerイメージをホストしている <a href="https://hub.docker.com/" target="_blank">Docker Hub</a> の方針が2020年秋頃より変わり、頻繁にpullされないイメージは自動削除の対象になったようで、該当のPHPバージョンのDockerイメージが消えててpullできずエラーになる場合があります。
その際は、以下の方法でご自分の環境で直接イメージをビルドすることで対応できますのでお試しください。

<pre class="cmd">
git clone https://github.com/kazaoki/anyenv-bins.git
docker build -t kazaoki/phpenv:7.4.4 anyenv-bins/phpenv/centos7/7.4.4/
</pre>

ビルド完了までめっちゃ時間かかりますが気長に待ちましょう。（30分とか1時間とか）

さらに、うまくビルドできずエラーで終了してるっぽい場合は、該当バージョンの `Dockerfile` の、

`～ --with-imap-ssl" ～`

となっている箇所を、

`～ --with-imap-ssl --with-kerberos" ～`

として再度ビルドしてみてください。
うまくいったらお慰み😃
