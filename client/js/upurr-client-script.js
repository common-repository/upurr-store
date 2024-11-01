jQuery(document).ready(function($){

    const apiBaseUrl = ajax_object.api_base_url;
    const upurrFaviconUrl = ajax_object.cdn_base_url + '/internal/favicons/favicon_v2_500x500.svg';
    const upurrStyleUrl = 'https://web.upurr.co.uk/triggers/css/trigger.min.css';
    const upurrTokenParam = 'upct';
    const urlSearchParams = new URLSearchParams(window.location.search);

    let isConnected = false;
    let upurrBtn = null;

    if (urlSearchParams.has(upurrTokenParam)) {
        const token = urlSearchParams.get(upurrTokenParam);
        localStorage.setItem(upurrTokenParam, token);
    }

    if (localStorage.getItem(upurrTokenParam)) {
        upurrAddStyle();
        upurrConnectionState();
    }

    function upurrAddStyle() {
        $('head').append('<link rel="stylesheet" href="' + upurrStyleUrl + '" type="text/css" />');
    }

    function upurrConnectionState() {
        $.ajax({
            url: apiBaseUrl + '/api/platform/state',
            headers: {
                'Content-Type':'application/json'
            },
            method: 'GET',
            dataType: 'json',
            data: { 
                origin: document.location.origin
            },
            success: function(response){
                if (response) {
                    isConnected = true;
                    upurrRenderCartTrigger();
                } 
                else {
                    isConnected = false;
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    function upurrGetCart() {
        $.ajax({
            url: ajax_object.ajax_url,
            method: 'POST',
            data: {
                action: 'upurr_cart_action'
            },
            success: function(response){
                if (response.success) {
                    upurrSendCart(response.data);
                }
                else {
                    console.log('Could not get cart items');
                }           
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    function upurrSendCart(cart) {
        var json = {
            token: localStorage.getItem(upurrTokenParam),
            cart: JSON.stringify(cart),
        };

        var content = JSON.stringify(json);

        $.ajax({
            url: apiBaseUrl + '/api/woocommerce/cart',
            headers: {
                'Content-Type':'application/json'
            },
            method: 'POST',
            dataType: 'json',
            data: content,
            success: function(){
                if (upurrBtn) {
                    upurrBtn.classList.remove("pending");
                }
            },
            error: function(data, textStatus, jqXHR) {
                if (jqXHR.status == 401) {
                    alert("Your Upurr session has expired. Please close this window and relaunch this store from the Upurr app.");
                }

                if (upurrBtn) {
                    upurrBtn.classList.remove("pending");
                }
            }
        });
    }

    function upurrRenderCartTrigger() {
        if (localStorage.getItem(upurrTokenParam)) {
            $('body').append('<div><div id="upurr-container"><button id="upurr-btn" type="button"><img id="upurr-btn-favicon" src="' + upurrFaviconUrl + '" alt="upurr"></button></div></div>');
            upurrBtn = document.getElementById("upurr-btn");

            const upurrContainer = document.getElementById("upurr-container");       
            setTimeout(() => {
                upurrContainer.classList.add("active");
            }, 500);

            upurrRegisterClickEvent();
        }    
    }

    function upurrRegisterClickEvent() {
        $('#upurr-btn').click(function(){
            if (upurrBtn) {
                upurrBtn.classList.add("pending");
            }
            
            if(isConnected) {
                upurrGetCart();
            }       
        });
    }
});