(function($) {
	var CHINASTORIES = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {
			common: {
				go: function(topPos, speed, callback) {
					var curTopPos = $sel.window.scrollTop(),
						diffTopPos = Math.abs(topPos - curTopPos);
					$sel.body.add($sel.html).animate({
						"scrollTop": topPos
					}, speed, function() {
						if(callback) {
							callback();
						}
					});
				}
			},

			scrollAnimation: {
				blocks: [],

				init: function() {
					var self = this;

					$("[data-animationblock]:not(.animated)").each(function() {
						var $item = $(this),
							itemAnimation = $item.data("animationtype"),
							itemAnimationDuration = $item.data("animationduration");

						if (!itemAnimationDuration) {
							itemAnimationDuration = 0;
						}

						self.blocks.push({
							"html": $item,
							"top": $item.offset().top,
							"typeAnimation": itemAnimation,
							"animation-duration" : itemAnimationDuration
						});

						$item.addClass("before-" + itemAnimation);
						$item.css("animation-duration", itemAnimationDuration);

					});

					$sel.window.on("scroll", function() {
						self.check();
					});

					setTimeout(function() {
						self.check();
					}, 50);

					self.fixedBlock();
				},

				check: function() {
					var self = this,
						block = false,
						blockTop = false,
						top = $sel.window.scrollTop(),
						buffer = parseInt($sel.window.height()) / 1.8;
					for(var i = 0, len = self.blocks.length; i < len; i++) {
						block = self.blocks[i],
						blockTop = parseInt(block.top, 10);
						if(block.html.hasClass("animated")) {
							continue;
						}
						if(top + buffer >= blockTop) {
							block.html.addClass("animated");
						}

					}
				}
			},

			mobileMenu:{
				button: $(".header-burger"),
				menu: $(".mobile-menu"),
				close: $(".mobile-menu-close"),

				init: function() {
					var self = this;

					self.button.on("click", function() {
						var btn = $(this);

						if (!btn.hasClass("active")) {
							btn.removeClass("close");
							btn.addClass("active");

							setTimeout(function() {
								btn.addClass("active--hover");
							}, 300);

							self.show(self.menu);
						} else {
							btn.removeClass("active--hover");

							setTimeout(function() {
								btn.removeClass("active");
								btn.addClass("close");
							}, 300);

							self.hide(self.menu);
						}
					});
				},

				show: function(menu) {
					var self = this;

					menu.addClass("active-block");

					setTimeout(function() {

						menu.addClass("active-show");

						$sel.body.addClass("open-menu");

					}, 200);
				},

				hide: function(menu) {
					var self = this;

					menu.removeClass("active-show");

					setTimeout(function() {

						$sel.body.removeClass("open-menu");

					}, 300);

					setTimeout(function() {

						menu.removeClass("active-block");

					}, 600);
				}
			},

			sliders: {

				init: function() {
					var self = this,
						$contentSlider = $(".content-slider");

					self.slickContentSlider($contentSlider);

				},

				slickContentSlider: function(slider) {
					var self = this;

					slider.each(function() {
						(function(sliderItem) {
							var	$contentSlider = sliderItem.parents(".content-slider-container"),
								$slider = $contentSlider.find(sliderItem),
								$itemSlider = $(".content-slider-item", sliderItem),
								$arrowContainer = $(".content-slider-arrows", $contentSlider);

							self.sliderEffect($slider, $itemSlider, $arrowContainer, true);
						})($(this));
					});


				},

				sliderEffect: function(slider, itemSlider, arrowContainer, autoplay) {
					var self= this;

					autoplay = autoplay ? true : false;

					if (autoplay) {
						autoplay = true;
						var autoplaySpeed = 300;
					}
					slider.slick({
						arrows: true,
						appendArrows: arrowContainer,
						autoplay: autoplay,
  						autoplaySpeed: autoplaySpeed,
						prevArrow: '<div class="slick-arrow-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.04 74.55"><g data-name="Слой 2"><path d="M78.74 74.55L58.22 36.9 80 0 0 35.89z" fill="#bd1d1d" data-name="Слой 1"/></g></svg></div>',
						nextArrow: '<div class="slick-arrow-next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79.8 74.93"><g data-name="Слой 2"><path d="M0 0l21.28 37.47L0 74.93l79.8-37.46z" fill="#bd1d1d" data-name="Слой 1"/></g></svg></div>',
						infinite: true,
						speed: 800,
						slidesToShow: 1,
						autoplaySpeed: 6000,
					});

					itemSlider.on("mousedown", function() {
						item = $(this);
						item.css("cursor", "-webkit-grab");
					})

					itemSlider.on("mouseup", function() {
						item = $(this);
						item.css("cursor", "pointer");
					})

				},
			}

		};

	})();

	CHINASTORIES.mobileMenu.init();
	CHINASTORIES.sliders.init();

})(jQuery);
