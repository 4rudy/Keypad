var checking = false;
var password = undefined;

window.addEventListener('message', function (event) {
    if (event.data.type == "open") {
        if (event.data.password != undefined) {
            password = event.data.password;
            $('body').removeClass('hidden').addClass('block');
            $('#passwordInput').focus();
        }
    }
})

function closeUI() {
    checking = false;
    password = undefined;
    $('.status').addClass('idle');
    $('#status').text('WAITING');
    $('#passwordInput').val('');
    $('body').removeClass('block').addClass('hidden');
    $.post('https://4rd-keypad/close');
}

function numpad(pad) {
    if (pad == 'clear') {
        if (checking == false) {
            $('#passwordInput').val('');
        }
    } else if (pad == 'enter') {
        checking = true;
        $('.status').removeClass('idle').addClass('checking');
        $('#status').text('CHECKING...');
        if (password != 'setpass') {
            setTimeout(() => {
                if ($('#passwordInput').val() == password) {
                    $('.status').removeClass('checking').addClass('approved');
                    $('#status').text('APPROVED');
                    setTimeout(() => {
                        $('.status').removeClass('approved')
                        closeUI()
                        $.post('https://4rd-keypad/keypadResult', JSON.stringify({
                            status: true,
                        }));
                    }, 2000);
                } else {
                    $('.status').removeClass('checking').addClass('denied');
                    $('#status').text('ACCESS DENIED');
                    setTimeout(() => {
                        $('.status').removeClass('denied')
                        closeUI()
                        $.post('https://4rd-keypad/keypadResult', JSON.stringify({
                            status: false,
                        }));
                    }, 2000);
                }
            }, 2000);
        } else {
            setTimeout(() => {
                $('.status').removeClass('checking').addClass('approved');
                $('#status').text('APPROVED');
                setTimeout(() => {
                    $('.status').removeClass('approved')
                    closeUI()
                    $.post('https://4rd-keypad/keypadResult', JSON.stringify({
                        status: true,
                    }));
                }, 2000);
            }, 2000);
        }
    } else if (pad == 'backspace') {
        if (checking == false) {
            let currentValue = $('#passwordInput').val();
            $('#passwordInput').val(currentValue.slice(0, -1));
        }
    } else {
        if (checking == false) {
            let oldvalue = $('#passwordInput').val();
            if (oldvalue.length < 8) {
                if (!isNaN(pad) && pad.length === 1) {
                    $('#passwordInput').val(oldvalue + pad);
                }
            }
        }
    }
}

$(document).on('keyup', function (evt) {
    if (evt.keyCode == 27) {
        $('body').removeClass('block').addClass('hidden');
        $.post('https://4rd-keypad/close');
        $.post('https://4rd-keypad/keypadResult', JSON.stringify({
            status: false,
        }));
    } else if (evt.keyCode === 13) {
        numpad('enter');
    }
});
