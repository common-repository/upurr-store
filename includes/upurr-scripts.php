<?php

add_action('admin_enqueue_scripts', 'upurr_admin_scripts');

function upurr_admin_scripts() {

    wp_enqueue_script(
        'upurr-admin',
        UPURR_URL . 'admin/js/upurr-admin-script.js',
        ['jquery'],
        time()
    );

    wp_localize_script(
        'upurr-admin',
        'ajax_object', 
        array( 
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'api_base_url' => UPURR_API_BASE_URL
        ) );

}

add_action('wp_enqueue_scripts', 'upurr_client_scripts');

function upurr_client_scripts() {

    wp_enqueue_script(
        'upurr-client',
        UPURR_URL . 'client/js/upurr-client-script.js',
        ['jquery'],
        time()
    );

    wp_localize_script(
        'upurr-client',
        'ajax_object', 
        array( 
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'api_base_url' => UPURR_API_BASE_URL,
            'cdn_base_url' => UPURR_CDN_BASE_URL
        ) );

}

?>