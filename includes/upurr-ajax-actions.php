<?php

add_action( 'wp_ajax_upurr_cart_action', 'upurr_cart_action' );
add_action( 'wp_ajax_nopriv_upurr_cart_action', 'upurr_cart_action' );

function upurr_cart_action() {

    $cart->cart = WC()->cart;
    $cart->total_price = WC()->cart->cart_contents_total;
    $cart->item_count = WC()->cart->get_cart_contents_count();
    $cart->shipping_total = WC()->cart->get_shipping_total();
    $cart->currency = get_woocommerce_currency();

    wp_send_json_success( $cart );
    wp_die();
    
}

add_action( 'wp_ajax_upurr_key_action', 'upurr_key_action' );
add_action( 'wp_ajax_nopriv_upurr_key_action', 'upurr_key_action' );

function upurr_key_action() {

    $token = $_REQUEST['token'];
    $storeId = $_REQUEST['storeId'];
    $remote_url = UPURR_API_BASE_URL . '/api/platform/key?storeId=' . $storeId;
    $args = array(
        'headers' => array(
            'Authorization' => 'Bearer ' . $token,
        )
    );
    $request = wp_remote_get( $remote_url, $args );

    if(!is_wp_error( $request )) {
        $body = wp_remote_retrieve_body( $request );
        $data = json_decode( $body );

        if(!empty( $data->key )) {
            $api_key = $data->key;    
            $api_exists = get_option('upurr_api_key');

            if (!empty( $api_key ) && !empty( $api_exists )) {
                update_option('upurr_api_key', $api_key);
            } else {
                add_option('upurr_api_key', $api_key);
            }

            wp_send_json_success();
        }
    }

    wp_die();
    
}

?>