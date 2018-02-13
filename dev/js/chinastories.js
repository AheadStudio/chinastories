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

			ajaxLoader: function() {
				$sel.body.on("click", ".load-more", function(event) {
					var $linkAddress = $(this),
						href = $linkAddress.attr("href"),
						$container = $($linkAddress.data("container"));

					$linkAddress.addClass("loading");

					(function(href, $container) {
						$.ajax({
							url: href,
							success: function(data) {
								var $data = $(data).addClass("load-events-item");
									$container.append($data);
								setTimeout(function() {
									CHINASTORIES.common.go($container.find(".load-events-item").offset().top-120, 1000);
									$container.find(".load-events-item").removeClass("load-events-item");
									$linkAddress.removeClass("loading");
								}, 100);
								setTimeout(function() {
									CHINASTORIES.reload();
								}, 300);
							}
						})
					})(href, $container);
					event.preventDefault();
				})
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
						nextArrow: '<div class="slick-arrow-next"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79.8 74.93"><g data-name="Слой 2"><path d="M0 0l21.28 37.47L0 74.93l79.8-37.46z" fill="#bd1d1d" data-name="Слой 1"/></g></svg></div>',						infinite: true,
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

			},

			maps: {
				init: function() {
					$(".map", $sel.body).each(function() {
						var $map = $(this),
							lng = parseFloat($map.data("lng"), 10) || 0,
							lat = parseFloat($map.data("lat"), 10) || 0,
							zoom = parseInt($map.data("zoom"));

						var options = {
							center: new google.maps.LatLng(lat, lng),
							zoom: zoom,
							mapTypeControl: false,
							panControl: false,
							zoomControl: true,
							zoomControlOptions: {
								style: google.maps.ZoomControlStyle.LARGE,
								position: google.maps.ControlPosition.TOP_RIGHT
							},
							scaleControl: true,
							streetViewControl: true,
							streetViewControlOptions: {
								position: google.maps.ControlPosition.TOP_RIGHT
							},
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							styles: [
								{"featureType": "landscape", "stylers": [
									{"saturation": -100},
									{"lightness": 0},
									{"visibility": "on"}
								]},
								{"featureType": "poi", "stylers": [
									{"saturation": -300},
									{"lightness": -10},
									{"visibility": "simplified"}
								]},
								{"featureType": "road.highway", "stylers": [
									{"saturation": -100},
									{"visibility": "simplified"}
								]},
								{"featureType": "road.arterial", "stylers": [
									{"saturation": -100},
									{"lightness": 0},
									{"visibility": "on"}
								]},
								{"featureType": "road.local", "stylers": [
									{"saturation": -100},
									{"lightness": 0},
									{"visibility": "on"}
								]},
								{"featureType": "transit", "stylers": [
									{"saturation": -100},
									{"visibility": "simplified"}
								]},
								{"featureType": "administrative.province", "stylers": [
									{"visibility": "off"}
								]},
								{"featureType": "water", "elementType": "labels", "stylers": [
									{"visibility": "on"},
									{"lightness": -25},
									{"saturation": -100}
								]},
								{"featureType": "water", "elementType": "geometry", "stylers": [
									{"hue": "#ffff00"},
									{"lightness": -25},
									{"saturation": -97}
								]}
							]
						};

						var iconMap= {
							url: $map.data("icon"),
							size: new google.maps.Size(45, 65),
						};
						var api = new google.maps.Map($map[0], options);
						var point = new google.maps.Marker({
							position: new google.maps.LatLng(lat, lng),
							map: api,
							icon: $map.data("icon")
						});

					});
				}
			},

			forms: {

				init: function($form) {
					var self = this;

					if (!$form) {
						var $form = $sel.body;
					}

					self.dataMobile();
					self.validateForm();
					self.replaceStandartInputs($form);
					self.reloadJcf($(".form"));

					// step form initialization
					self.stepForm.init($(".form"));

				},

				dataMobile: function() {
					var self = this;
					$("[data-number]").each(function() {
						var $item = $(this);
						$item.mask($item.data("number"));
					});
				},

				validateForm: function() {
					var self = this;

					$(".form", $sel.body).each(function() {
						var $form = $(this),
							$formFields = $form.find("[data-error]"),
							formParams = {
								rules: {
								},
								messages: {
								}
							};

						$.validator.addMethod("mobileRU", function(phone_number, element) {
							phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
							return this.optional(element) || phone_number.length > 5 && phone_number.match(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{6,10}$/);
						}, "Error");

						$formFields.each(function() {
							var $field = $(this),
								fieldPattern = $field.data("pattern"),
								fieldError = $field.data("error");
							if(fieldError) {
								formParams.messages[$field.attr("name")] = $field.data("error");
							} else {
								formParams.messages[$field.attr("name")] = "Ошибка заполнения";
							}
							if(fieldPattern) {
								formParams.rules[$field.attr("name")] = {};
								formParams.rules[$field.attr("name")][fieldPattern] = true;
							}
						});

						if($form.data("success")) {

							formParams.submitHandler = function(form) {

								/*var options = {
									type: "ajax",
									bcgcolor: "#fff",
									customclass: "form-call-container",
									btnclosetml: '<button data-lazymodal-close class="lazy-modal-close">'+
													'<span class="form-close"></span>'+
												 '</button>',
								    positionclose: "inside",
									init: function(obj) {
										obj.options.htmlContent = $(".form", obj.options.htmlContent);
									},
								};
								$.lazymodal.open($("button",$form), options, $form.data("success"));*/
							};
						}
						$form.validate(formParams);
					});
				},

				replaceStandartInputs: function($form) {
					var $selects = $("select", $form),
						$numbers = $("input[type=number]", $form);

					jcf.setOptions("Select", {
						wrapNative: false,
						wrapNativeOnMobile: false,
						maxVisibleItems: 6,
					});

					jcf.setOptions("Number", {
						pressInterval: "150",
						disabledClass: "jcf-disabled"
					});


					$selects.each(function() {
						var $select = $(this);
						jcf.replace($select);
					});

					$numbers.each(function() {
						var $number = $(this);
						jcf.replace($number);
					});


				},

				reloadJcf: function($form) {
					$form.submit(function(event) {
						var form = $(event.target),
							$formItems = $form.find(".form-item");

						$formItems.each(function() {
							(function(el) {
								jcf.refresh(el);
							})($(this))
						});
					});
				},

				stepForm: {
					form: false,

					activeFormItem: false,

					firstInit: true,

					stepFormFontainer: $(".form-steps"),

					step: $(".form-steps").data("formstep"),

					stepText: $(".form-step-text"),

					resultForm: $(".form-result-info"),

					resultFormText:  $(".form-result-info").data("formresult"),

					init: function(form) {
						var self = this;

						self.form = form;

						setTimeout(function() {
							self.stepFormFontainer.removeClass("preload");
						}, 300);

						self.setStep();
						self.changeStep(form);
					},

					setStep: function() {
						var self = this,
							$allFormStep = $(".form-step:not(.form-step--"+self.step+")", self.stepFormFontainer),
							$activeFormStep = $(".form-step--"+self.step, self.stepFormFontainer);

						if (self.firstInit) {
							$allFormStep.each(function() {
								(function(el) {
									el.addClass("disabled");
								})($(this));
							});

							self.firstInit = false;
						} else {
							$allFormStep.each(function() {
								(function(el) {
									el.addClass("hide-show");

									setTimeout(function() {
										el.addClass("disabled");
									}, 300);

								})($(this));
							});

							$activeFormStep.removeClass("disabled");
							setTimeout(function() {
								$activeFormStep.removeClass("hide-show");
							}, 400);

						}

						self.stepText.each(function() {
							(function(el) {
								var elText = el.data("steptext"),
									changeText = elText.replace(/\{\w*\}/, self.step);
									changeTextData = elText.replace(/\{\w*\}/, "{"+self.step+"}");

								el.text(changeText);
								el.attr("data-steptext", changeTextData);

							})($(this));
						});

						(function(activeForm) {
							self.activeFormItem = activeForm.find(".form-item");
							self.wathChanges();
						})($activeFormStep);

					},

					changeStep: function() {
						var self = this,
							$buttonStepNext = $("[data-nextstep]"),
							$buttonStepPrev = $("[data-prevstep]");

						$buttonStepNext.each(function() {
							(function(el) {
								el.on("click", function(e) {
									var button = $(this),
										buttonStepNumber = button.data("nextstep");

									self.step = buttonStepNumber;

									if (self.form.valid()) {
										self.setStep();
									} else {
										self.activeFormItem.each(function() {
											if ($(this).hasClass("form-item--select") || $(this).hasClass("form-item--number")) {
												(function(el) {
													jcf.refresh(el);
												})($(this))
											}
										});
									}

								});
							})($(this))
						})
						$buttonStepPrev.each(function() {
							(function(el) {
								el.on("click", function(e) {
									var button = $(this),
										buttonStepNumber = button.data("prevstep");

									self.step = buttonStepNumber;
									self.setStep();
									e.preventDefault();
								});

							})($(this))
						})

					},

					wathChanges: function() {
						var self = this;

						self.activeFormItem.each(function() {
							(function(elementsForm) {
								elementsForm.on("change", function() {
									var el = $(this),
										idEL = el.attr("id");

									self.resultFormText[idEL] = el.val();

									self.resultForm.attr("data-formresult", JSON.stringify(self.resultFormText));

									if ($(this).hasClass("form-item--select") || $(this).hasClass("form-item--number")) {
										jcf.refresh($(this));
									}
								});
							})($(this))
						})
					}


				}

			},



		};

	})();

	CHINASTORIES.mobileMenu.init();
	CHINASTORIES.sliders.init();
	CHINASTORIES.maps.init();
	CHINASTORIES.forms.init();
	CHINASTORIES.ajaxLoader();

	CHINASTORIES.reload = function() {};
})(jQuery);
