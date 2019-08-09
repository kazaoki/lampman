<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Sample</title>
</head>
<body>

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
                            <td class="e"><?= $key ?></td>
                            <td class="v"><?= $_ENV[$key] ?></td>
                        </tr>
                        <?php
                    }
                }
                ?>
            </tbody>
        </table>
    </div>
</section>

<section>
    <?php $dbh = new PDO('mysql:host=main.db;dbname=test', 'test', 'test'); ?>
    <h1>MYSQL CONNECT TEST</h1>
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
                    <td class="e"><?= $sth->queryString ?></td>
                    <td class="v"><?= $row[0]['now'] ?></td>
                </tr>
                <?php
                try {
                    $sth = $dbh->query('SELECT COUNT(*) as count FROM managers');
                    $row = $sth->fetchAll();
                } catch(PDOException $e) {
                    var_dump($e->getMessage());
                }
                ?>
                <tr>
                    <td class="e"><?= $sth->queryString ?></td>
                    <td class="v"><?= $row[0]['count'] ?></td>
                </tr>
            </tbody>
        </table>
    </div>
</section>

<section>
    <h1>PHP INFO</h1>
    <?php phpinfo() ?>
</section>

</body>
</html>
