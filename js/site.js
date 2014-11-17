currentState = {'#carousel-one': false, '#carousel-due': false, '#carousel-tre': false};

function Ridimensiona() {
    var height = $(window).height() + 'px';
    var width = $(window).width() + 'px';
    var itemHeight = $(window).height() * 22 / 100 + 'px';
    var imgHeight = $(window).height() * 20 / 100 + 'px';

    $('html').css({
        height: height,
        width: width
    });
    $('.container').css({
        height: height,
        width: width
    });
    $('body').css({
        height: height,
        width: width
    });
    $('#leftcurtain').css({
        height: height,

    });
    $('#rightcurtain').css({
        height: height,

    });
    $('.shelf').css({
        width: width

    });
    $('.scene').css({
        height: itemHeight

    });
    $('.scene img').css({
        height: imgHeight

    });


}

function vaiSlider(name) {
    $(name).slick({
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 5,
        lazyLoad: 'ondemand',
        arrows: false,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true

                }
    },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
    },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
    }
  ]


    });

}

function recuperaDati(jsonUrl, carouselId) {
    $.ajax({
        url: jsonUrl,
        type: "GET",
        data: {
            id: $(this).value
        },
        contentType: "application/json; charset=utf-8",
        dataType: "JSON",
        beforeSend: function (jqXHR, settings) {
            //attivo loader sul body
            //Scelta 1 : ho il loader nel dom da in display none:
            $('.loader-image').show();
            //Scelta 2 appendo il loader creandolo da zero
            //$('body').append($('img', {
            //class: 'loader-image',
            // src: '/loading.gif'

        },
        success: function (data) {
            return onSuccess(data, carouselId);
        },

        // error: function (jqXHR, textStatus, errorThrown) {
        // console.log(jqXHR);
        // console.log(textStatus);
        // console.log(errorThrown);
        // },
        complete: function (data) {
            //disattivo loader sul body
            //Scelta 1/2 : ho il loader nel dom da in qualche modo:
            $('.loader-image').hide();
        }
    });
}

onSuccess = function (data , carousel) {
        //il json che ritorna "/il_mio_json.php"
    
        currentState[carousel] = true;
    
        done = true;
        keys = Object.keys(currentState);
        console.log(keys);
        keys.forEach(function(k) {
            if (!currentState[k])
                done = false;
        });
        if (done)
           // history.pushState({json: data, carouselId: '#carousel-one'}, null);
             history.pushState({json: data, carouselId: carousel}, null);
    
        for (var i = 0; i < data.length; i++) {

            var $img = $('<img></img>');
            var $scene = $('<div class=\'scene\'></div>');
            var $name = $('<div class=\'name\'>' + data[i].category + '</div>');
            var $variuos = $('<a class=\'various\'></a>');
            var $div = $('<div></div>');

            $img.attr('src', data[i].image);
            $scene.append($img);
            $scene.append($name);
            $variuos.append($scene);
            $div.append($variuos);

            $div.data('url_item', data[i].url);

            $(carousel).append($div);
            AniJS.run();

            $div.click(function (event) {
                var urlItem = $(this).data('url_item');
                
                //history.pushState({json: data, carouselId: carousel}, null)
                           
                $(carousel).remove();
                
                //h = '<div id=\'' + carousel.slice(1) + '\' class=\'responsive\'></div>';                
                //$('.sliderContainer').append(h);
                h1 = '<div id=\'\carousel-one\' class=\'responsive\'></div>'
                h2 = '<div id=\'\carousel-due\' class=\'responsive\'></div>'
                h3 = '<div id=\'\carousel-tre\' class=\'responsive\'></div>'
                $('.sliderContUno').append(h1);
                $('.sliderContDue').append(h2);
                $('.sliderContTre').append(h3);
                
                recuperaDati(urlItem, carousel);
            });
        }
        Ridimensiona();

        vaiSlider(carousel);
};

$(document).ready(function () {
    Ridimensiona();
    $(window).load(function () {
        Ridimensiona();
    });
    $(window).resize(function () {
        Ridimensiona();
    });

    $(function () {
        $('#rope').click(function () {
            $('#leftcurtain').animate({
                left: '-50%'
            }, 1000);
            $('#rightcurtain').animate({
                right: '-51%'
            }, 1000).delay(1000);
            $('#rope').hide();

        });
    });

    recuperaDati("./data/uno.php" , '#carousel-one');
    recuperaDati("./data/uno.php" , '#carousel-due');
    recuperaDati("./data/uno.php" , '#carousel-tre');
    
});

window.onpopstate = function (event) {
    console.log(event.state);

    if (event.state == null) return;

    data = event.state;

    $(data.carouselId).remove();
    //$('.sliderContainer').append('<div id=\''+ data.carouselId.slice(1) +'\' class=\'responsive\'></div>');
    
    h1 = '<div id=\'\carousel-one\' class=\'responsive\'></div>'
    h2 = '<div id=\'\carousel-due\' class=\'responsive\'></div>'
    h3 = '<div id=\'\carousel-tre\' class=\'responsive\'></div>'
    $('.sliderContUno').append(h1);
    $('.sliderContDue').append(h2);
    $('.sliderContTre').append(h3);

    onSuccess(data.json, data.carouselId);
};