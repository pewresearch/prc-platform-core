<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit6ba249f3c828fe57c4ed37ffee2e0a6b
{
    public static $files = array (
        'c34dc34eb7eec77023209fe27e4e18e8' => __DIR__ . '/..' . '/woocommerce/action-scheduler/action-scheduler.php',
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->classMap = ComposerStaticInit6ba249f3c828fe57c4ed37ffee2e0a6b::$classMap;

        }, null, ClassLoader::class);
    }
}