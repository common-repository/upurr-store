<?php

add_action('admin_menu', 'upurr_settings_page');

function upurr_settings_page() {

    add_menu_page(
        UPURR_NAME,
        UPURR_NAME,
        'manage_options',
        'upurrstore',
        'upurr_settings_page_markup',
        'dashicons-store',
        100
    );

}

function upurr_settings_page_markup() {

    if( !current_user_can('manage_options') ) {
        return;
    }

    ?>
        <div class="wrap">
            <h1 class="upurr__primary-heading"><?php esc_html_e( get_admin_page_title() ) ?></h1>
            <p class="upurr__primary-sub-heading">Connecting to your shoppers.</p>

            <div class="upurr__banner-wrapper">
                <div class="upurr__banner upurr__connected" id="upurrConnectedBanner">
                    <h2 class="upurr__secondary-heading">You are connected.</h2>
                    <p><strong>Stay connected.</strong> Disconnecting will deactivate your Upurr Store Profile and will prevent shoppers from being able to purchase products.</p>
                </div>
                <div class="upurr__banner upurr__disconnected" id="upurrDisconnectedBanner">
                    <h2 class="upurr__secondary-heading">You are not connected!</h2>
                    <p><strong>Connect to your Upurr Store Profile.</strong> No shoppers will be able to purchase your products through Upurr until you are connected.</p>
                </div>
                <div class="upurr__banner upurr__placeholder" id="upurrPlaceholderBanner">
                    <span></span>
                    <span></span>
                </div>
            </div>

            <div class="upurr__card" id="upurrAuth">
                <h2 class="upurr__secondary-heading">Get started</h2>
                <p>To connect WooCommerce to your Upurr Store profile you will be required to authorise Upurr to read products and create orders.</p>
                <button class="button button-primary" id="upurrAuthBtn" type="button">Authorise</button>  
            </div>

            <div class="upurr__card" id="upurrConnection">
                <h2 class="upurr__secondary-heading">Get connected</h2>
                <p>Connect by simply entering your Upurr account email and password below. Not registered a Upurr account yet? <a href="https://upurr.co.uk/store" target="_blank">Register your store</a> on Upurr before connecting.</p>
                <div class="upurr__error" id="upurrError"></div>
                <form class="upurr__form" id="upurrForm">
                    <input class="upurr__form-input" id="upurrEmail" type="email" placeholder="Email Address" />
                    <div class="upurr__form-error-message" id="upurrEmailError">A valid email is required</div>
                    <input class="upurr__form-input" id="upurrPassword" type="password" placeholder="Password" />
                    <div class="upurr__form-error-message" id="upurrPasswordError">Your password is required</div>
                    <button class="upurr__form-button button button-primary" id="upurrSubmitBtn" type="button">Connect</button>
                    <button class="upurr__form-button button button-primary" id="upurrPendingBtn" type="button" disabled>Please wait...</button>
                </form>
                <div class="upurr__user-stores" id="upurrUserStores">
                    <p><strong>Please select the store you would like to connect.</strong></p>
                    <ul class="upurr__user-store-list" id="upurrUserStoresList"></ul>
                </div>
            </div>

            <div class="upurr__card upurr__placeholder" id="upurrPlaceholder">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div class="upurr__card">
                <h2 class="upurr__secondary-heading">Need help?</h2>
                <p>Check out the <a href="https://upurr.co.uk/docs/woocommerce">documentation and tutorials</a> on our website.</p>
            </div>

        </div>
    <?php

}

?>