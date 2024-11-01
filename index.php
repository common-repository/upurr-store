<?php
/**
 * Plugin Name: Upurr Store
 * Plugin URI: https://upurr.co.uk/docs/woocommerce
 * Description: The Upurr Store plugin for WooCommerce stores to connect their Upurr Store Profile.
 * Version: 1.0.0
 * Author: Upurr
*/

if (!defined("ABSPATH")) {
	exit; // Exit if accessed directly
}

$all_plugins = apply_filters('active_plugins', get_option('active_plugins'));
if (stripos(implode($all_plugins), 'woocommerce.php')) {
    
	define( 'UPURR_URL', plugin_dir_url( __FILE__ ) );
	define( 'UPURR_NAME', 'Upurr Store' );
	define( 'UPURR_API_BASE_URL', 'https://api.upurr.co.uk' );
	define( 'UPURR_CDN_BASE_URL', 'https://cdn.upurr.co.uk' );
	
	include( plugin_dir_path( __FILE__ ) . 'includes/upurr-styles.php' );
	include( plugin_dir_path( __FILE__ ) . 'includes/upurr-scripts.php' );
	include( plugin_dir_path( __FILE__ ) . 'includes/upurr-menus.php');
	include( plugin_dir_path( __FILE__ ) . 'includes/upurr-ajax-actions.php');

}

register_deactivation_hook(__FILE__, function () {
    $api_key = get_option('upurr_api_key');

    if (!empty( $api_key )) {
		$remote_url = UPURR_API_BASE_URL . '/api/platform/terminate?key=' . $api_key;
		wp_remote_get( $remote_url );
    }
});

?>