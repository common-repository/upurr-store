<?php

if (!defined( 'WP_UNINSTALL_PLUGIN')) {
	exit;
}

$api_key = get_option('upurr_api_key');
$origin = get_site_url();

if (!empty( $api_key )) {
    $remote_url = UPURR_API_BASE_URL . '/api/woocommerce/uninstall?origin=' . $origin . '&key=' . $api_key;
    wp_remote_get( $remote_url );
}

?>