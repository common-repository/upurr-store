jQuery(document).ready(function($){

    const apiBaseUrl = ajax_object.api_base_url;
    const urlSearchParams = new URLSearchParams(window.location.search);

    let passwordError = true;
    let emailError = true;

    $('#upurrConnectedBanner').hide();
    $('#upurrDisconnectedBanner').hide();
    $('#upurrConnection').hide();
    $('#upurrPendingBtn').hide();
    $('#upurrError').hide();
    $('#upurrEmailError').hide();
    $('#upurrPasswordError').hide();
    $('#upurrUserStores').hide();
    $('#upurrAuth').hide();

    upurrAuthState();
    upurrConnectionState();

    const email = document.getElementById('upurrEmail');
    email && email.addEventListener('blur', () => {
        upurrValidateEmail(email.value);      
    })

    const password = document.getElementById('upurrPassword');
    password && password.addEventListener('blur', () => {
        upurrValidatePassword(password.value);       
    })

    $("#upurrSubmitBtn").click(function(){
        $('#upurrError').hide();

        var inputs = $('#upurrForm :input');

        upurrValidateEmail(inputs[0].value);
        upurrValidatePassword(inputs[1].value);

        if (emailError || passwordError) {
            return;
        }
        else {
            upurrPending();
            upurrLogin(inputs[0].value, inputs[1].value);
        }
    });

    $("#upurrAuthBtn").click(function(){
        const storeUrl = location.origin;
        const endpoint = '/wc-auth/v1/authorize';
        const params = {
          app_name: 'Upurr Store',
          scope: 'read_write',
          user_id: location.origin,
          return_url: storeUrl + '/wp-admin/admin.php?page=upurrstore',
          callback_url: apiBaseUrl + '/api/woocommerce/callback'
        }; 
        const url = `${storeUrl}${endpoint}?app_name=${params.app_name}&scope=${params.scope}&user_id=${params.user_id}&return_url=${params.return_url}&callback_url=${params.callback_url}`

        window.location.href = url;
    });

    function upurrAuthState() {

        $('#upurrAuth').show();

        const authResultParam = 'success';

        if (urlSearchParams.has(authResultParam)) {
            const authResult = urlSearchParams.get(authResultParam);

            if (authResult == 1) {
                $('#upurrAuth').hide();
                $('#upurrConnection').show();
            }      
        }

    }

    function upurrLogin(email, password) {

        var json = {
            email: email,
            password: password
        };

        var content = JSON.stringify(json);

        $.ajax({
            url: apiBaseUrl + '/api/account/login',
            headers: {
                'Content-Type':'application/json'
            },
            method: 'POST',
            dataType: 'json',
            data: content,
            success: function(response){
                upurrGetStores(response.token);   
            },
            error: function(error) {
                if (error.status == 400) {            
                    $('#upurrError').html("The username or password is incorrect");
                    $('#upurrError').show();
                }
                upurrCompleted();
            }
        });

    }

    function upurrGetStores(token) {

        $.ajax({
            url: apiBaseUrl + '/api/store/user/list',
            headers: {
                'Authorization':'Bearer ' + token,
                'Content-Type':'application/json'
            },
            method: 'GET',
            dataType: 'json',
            success: function(response){
                if (response.length == 1) {
                    upurrInitialize(token, response[0].id);
                }
                else {
                    $('#upurrForm').hide();
                    $('#upurrUserStores').show();
                    
                    response.forEach(store => {
                        if (!store.isConnected) {
                            const li = $('<li>' + store.name + '</li>');
                            li.on('click', upurrInitialize.bind(null, token, store.id));
                            $("#upurrUserStoresList").append(li)
                        }
                    });
                }
            },
            error: function(error) {
                upurrCompleted();
                $('#upurrError').html('You were not able to retrieve your store/s. Please <a href="https://upurr.co.uk/contact?subject=woocommerce" target="_blank">contact support</a> and an account manager will assist you with your connection.');
                $('#upurrError').show();
                console.log(error);
            }
        });

    }

    function upurrInitialize(token, storeId) {

        $("#upurrUserStoresList").css("pointer-events", "none");

        $.ajax({
            url: apiBaseUrl + '/api/platform/initialize',
            headers: {
                'Authorization':'Bearer ' + token,
                'Content-Type':'application/json'
            },
            method: 'GET',
            data: { 
                origin: location.origin, 
                storeId: storeId, 
            },
            success: function(){
                upurrStoreKey(token, storeId);
            },
            error: function(error) {
                upurrCompleted();
                $('#upurrError').html('You were not able to initialise this store. Please <a href="https://upurr.co.uk/contact?subject=woocommerce" target="_blank">contact support</a> and an account manager will assist you with your connection.');
                $('#upurrError').show();
                console.log(error);
            }
        });

        $("#upurrUserStoresList").css("pointer-events", "unset");
    }

    function upurrStoreKey(token, storeId) {

        $.ajax({
            url: ajax_object.ajax_url,
            method: 'POST',
            data: {
                action: 'upurr_key_action',
                token: token,
                storeId: storeId
            },
            success: function(response){
                if (response.success) {
                    upurrCompleted();
                    upurrConnected();
                }
                else {
                    upurrCompleted();
                    $('#upurrError').html('You were not able to connect this store. Please <a href="https://upurr.co.uk/contact?subject=woocommerce" target="_blank">contact support</a> and an account manager will assist you with your connection.');
                    $('#upurrError').show();
                }           
            },
            error: function(error) {
                upurrCompleted();
                $('#upurrError').html('You were not able to connect this store. Please <a href="https://upurr.co.uk/contact?subject=woocommerce" target="_blank">contact support</a> and an account manager will assist you with your connection.');
                $('#upurrError').show();
                console.log(error);
            }
        });

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
                origin: decodeURI(location.origin)
            },
            success: function(response){
                if (response) {
                    upurrConnected();
                } 
                else {
                    upurrDisconnected();
                }

                $('#upurrPlaceholderBanner').hide();
                $('#upurrPlaceholder').hide();
            },
            error: function(error) {
                console.log(error);
            }
        });

    }

    function upurrPending() {

        $('#upurrSubmitBtn').hide();
        $('#upurrPendingBtn').show();

    }

    function upurrCompleted() {

        $('#upurrSubmitBtn').show();
        $('#upurrPendingBtn').hide();

    }

    function upurrConnected() {

        $('#upurrConnection').hide();
        $('#upurrUserStores').hide();
        $('#upurrDisconnectedBanner').hide();
        $('#upurrAuth').hide();

        $('#upurrConnected').show();
        $('#upurrConnectedBanner').show();
        
    }

    function upurrDisconnected() {

        $('#upurrUserStores').hide();
        $('#upurrConnected').hide();
        $('#upurrConnectedBanner').hide();

        $('#upurrDisconnectedBanner').show();
        
    }

    function upurrValidatePassword(value) {

        if (value) {
            passwordError = false;
            $('#upurrPasswordError').hide();
        }
        else {
            passwordError = true;
            $('#upurrPasswordError').show();
        }

    }

    function upurrValidateEmail(value) {

        let regex = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;  

        if (regex.test(value)) {
            emailError = false;
            $('#upurrEmailError').hide();
        }
        else {
            emailError = true;
            $('#upurrEmailError').show();
        }
        
    }

});