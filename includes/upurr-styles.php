<?php

add_action('admin_enqueue_scripts', 'upurr_admin_styles');

function upurr_admin_styles() {

    wp_enqueue_style(
        'upurr-admin',
        UPURR_URL . 'admin/css/upurr-admin-style.css',
        [],
        time()
    );

}

?>