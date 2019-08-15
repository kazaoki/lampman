<?php

error_reporting(E_ALL);

require 'jp_send_mail.php';
$result = jp_send_mail([
    'to'      => '㈱あてさき様 <to@example.com>',
    'from'    => 'おくりもと <from@example.com>',
    'subject' => 'お問い合わせありがとうございました。',
    'body'    => 'テストメールです。',
]);
?>

result = <?= $result ?>

<br><br><br>

<a href="/">back</a>
