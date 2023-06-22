<?php return array(
    'root' => array(
        'name' => 'pewresearch/prc-platform-core',
        'pretty_version' => 'dev-main',
        'version' => 'dev-main',
        'reference' => 'feee6ea409371752bd6709c5872a8fa16b35e06f',
        'type' => 'library',
        'install_path' => __DIR__ . '/../../',
        'aliases' => array(),
        'dev' => true,
    ),
    'versions' => array(
        '10up/term-data-store' => array(
            'pretty_version' => 'dev-master',
            'version' => 'dev-master',
            'reference' => 'ba244f3413055867b604d2743279aa8a0f098323',
            'type' => 'library',
            'install_path' => __DIR__ . '/../10up/term-data-store',
            'aliases' => array(
                0 => '9999999-dev',
            ),
            'dev_requirement' => false,
        ),
        'composer/installers' => array(
            'pretty_version' => 'v1.12.0',
            'version' => '1.12.0.0',
            'reference' => 'd20a64ed3c94748397ff5973488761b22f6d3f19',
            'type' => 'composer-plugin',
            'install_path' => __DIR__ . '/./installers',
            'aliases' => array(),
            'dev_requirement' => false,
        ),
        'humanmade/hm-rewrite' => array(
            'pretty_version' => '1.1.0',
            'version' => '1.1.0.0',
            'reference' => '3f4b3385db517559ae087845507a4799653ba612',
            'type' => 'wordpress-muplugin',
            'install_path' => __DIR__ . '/../../wp-content/mu-plugins/hm-rewrite',
            'aliases' => array(),
            'dev_requirement' => false,
        ),
        'pewresearch/prc-platform-core' => array(
            'pretty_version' => 'dev-main',
            'version' => 'dev-main',
            'reference' => 'feee6ea409371752bd6709c5872a8fa16b35e06f',
            'type' => 'library',
            'install_path' => __DIR__ . '/../../',
            'aliases' => array(),
            'dev_requirement' => false,
        ),
        'roundcube/plugin-installer' => array(
            'dev_requirement' => false,
            'replaced' => array(
                0 => '*',
            ),
        ),
        'shama/baton' => array(
            'dev_requirement' => false,
            'replaced' => array(
                0 => '*',
            ),
        ),
    ),
);
