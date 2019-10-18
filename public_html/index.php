<?php
// file_put_contents('app.log', date('Y-m-d H:i:s')."\n", FILE_APPEND);
// error_log('error-log-test');

$data = [
    'A1' => [
        'B2' => [
            111,
            222,
            333,
            'C3' => [
                444
            ]
        ]
    ]
];

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Sample</title>
</head>
<body>

<?php if('default'===getenv('LAMPMAN_MODE')) { ?>
<section>
    <h1>MAILDEV (<a href="http://<?php echo getenv('HTTP_HOST') ?>:9981" target="_blank">open blank window : port 9981</a>)</h1>
    <div class="center">
        <table>
            <tbody>
                <tr>
                    <td class="e">LAMPMAN_MAILDEV</td>
                    <td class="v"><?php echo getenv('LAMPMAN_MAILDEV') ?></td>
                </tr>
                <tr>
                    <td colspan="2">
                        <form action="mail-submit.php" method="post">
                            <button>テストメール送信</button>
                        </form>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</section>
<?php } ?>

<section>
    <h1>LAMPMAN ENV</h1>
    <div class="center">
        <table>
            <tbody>
                <?php
                $keys = array_keys($_ENV);
                sort($keys);
                foreach($keys as $key) {
                    if(preg_match('/^LAMPMAN/', $key)) {
                        ?>
                        <tr>
                            <td class="e"><?php echo $key ?></td>
                            <td class="v"><?php echo $_ENV[$key] ?></td>
                        </tr>
                        <?php
                    }
                }
                ?>
            </tbody>
        </table>
    </div>
</section>

<?php if(@$_ENV['LAMPMAN_MYSQLS'] && in_array('mysql', explode(', ', $_ENV['LAMPMAN_MYSQLS']))) { ?>
<section>
    <h1>MYSQL CONNECT TEST (main.db)</h1>
    <?php $dbh = new PDO('mysql:host=main.db;dbname=test', 'test', 'test'); ?>
    <div class="center">
        <table>
            <tbody>
                <?php
                try {
                    $sth = $dbh->query('SELECT NOW() as now');
                    $row = $sth->fetchAll();
                } catch(PDOException $e) {
                    var_dump($e->getMessage());
                }
                ?>
                <tr>
                    <td class="e"><?php echo $sth->queryString ?></td>
                    <td class="v"><?php echo $row[0]['now'] ?></td>
                </tr>
                <?php
                try {
                    $sth = $dbh->query('SELECT COUNT(*) as count FROM users');
                    $row = $sth->fetchAll();
                } catch(PDOException $e) {
                    var_dump($e->getMessage());
                }
                ?>
                <tr>
                    <td class="e"><?php echo $sth->queryString ?></td>
                    <td class="v"><?php echo $row[0]['count'] ?></td>
                </tr>
            </tbody>
        </table>
    </div>
</section>
<?php } ?>

<?php if(@$_ENV['LAMPMAN_MYSQLS'] && in_array('mysql_2', explode(', ', $_ENV['LAMPMAN_MYSQLS']))) { ?>
<section>
    <h1>MYSQL CONNECT TEST (main-2.db)</h1>
    <?php $dbh = new PDO('mysql:host=main-2.db;dbname=test2', 'test2', 'test2'); ?>
    <div class="center">
        <table>
            <tbody>
                <?php
                try {
                    $sth = $dbh->query('SELECT NOW() as now');
                    $row = $sth->fetchAll();
                } catch(PDOException $e) {
                    var_dump($e->getMessage());
                }
                ?>
                <tr>
                    <td class="e"><?php echo $sth->queryString ?></td>
                    <td class="v"><?php echo $row[0]['now'] ?></td>
                </tr>
                <?php
                try {
                    $sth = $dbh->query('SELECT COUNT(*) as count FROM users');
                    $row = $sth->fetchAll();
                } catch(PDOException $e) {
                    var_dump($e->getMessage());
                }
                ?>
                <tr>
                    <td class="e"><?php echo $sth->queryString ?></td>
                    <td class="v"><?php echo $row[0]['count'] ?></td>
                </tr>
            </tbody>
        </table>
    </div>
</section>
<?php } ?>

<?php if(@$_ENV['LAMPMAN_POSTGRESQLS'] && in_array('postgresql', explode(', ', $_ENV['LAMPMAN_POSTGRESQLS']))) { ?>
<section>
    <h1>POSTGRESQL CONNECT TEST (sub.db)</h1>
    <?php $pdbh = new PDO('pgsql:host=sub.db;dbname=test', 'test', 'test'); ?>
    <div class="center">
        <table>
            <tbody>
                <?php
                try {
                    $sth = $pdbh->query('SELECT NOW() as now');
                    $row = $sth->fetchAll();
                } catch(PDOException $e) {
                    var_dump($e->getMessage());
                }
                ?>
                <tr>
                    <td class="e"><?php echo $sth->queryString ?></td>
                    <td class="v"><?php echo $row[0]['now'] ?></td>
                </tr>
                <?php
                try {
                    $sth = $pdbh->query('SELECT COUNT(*) as count FROM users');
                    $row = $sth->fetchAll();
                } catch(PDOException $e) {
                    var_dump($e->getMessage());
                }
                ?>
                <tr>
                    <td class="e"><?php echo $sth->queryString ?></td>
                    <td class="v"><?php echo $row[0]['count'] ?></td>
                </tr>
            </tbody>
        </table>
    </div>
</section>
<?php } ?>

<?php if(@$_ENV['LAMPMAN_POSTGRESQLS'] && in_array('postgresql_b', explode(', ', $_ENV['LAMPMAN_POSTGRESQLS']))) { ?>
<section>
    <h1>POSTGRESQL CONNECT TEST (sub-b.db)</h1>
    <?php $pdbh = new PDO('pgsql:host=sub-b.db;dbname=testb', 'testb', 'testb'); ?>
    <div class="center">
        <table>
            <tbody>
                <?php
                try {
                    $sth = $pdbh->query('SELECT NOW() as now');
                    $row = $sth->fetchAll();
                } catch(PDOException $e) {
                    var_dump($e->getMessage());
                }
                ?>
                <tr>
                    <td class="e"><?php echo $sth->queryString ?></td>
                    <td class="v"><?php echo $row[0]['now'] ?></td>
                </tr>
                <?php
                try {
                    $sth = $pdbh->query('SELECT COUNT(*) as count FROM users');
                    $row = $sth->fetchAll();
                } catch(PDOException $e) {
                    var_dump($e->getMessage());
                }
                ?>
                <tr>
                    <td class="e"><?php echo $sth->queryString ?></td>
                    <td class="v"><?php echo $row[0]['count'] ?></td>
                </tr>
            </tbody>
        </table>
    </div>
</section>
<?php } ?>

<section>
    <h1>PHP INFO</h1>
    <?php phpinfo() ?>
</section>

</body>
</html>
