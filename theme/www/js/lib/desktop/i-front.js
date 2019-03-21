Util.Objects["front"] = new function() {
	this.init = function(scene) {

		scene.resized = function() {
			// u.bug("scene.resized:", this);

			if(this.slideshow_plans) {
				// Built-in slideshow resizer
				this.slideshow_plans.resized();

				// Resize ul
				u.ass(this.ul_plans, {
					"height":(this.ul_plans.offsetWidth / 2.6434) + "px"
				})
			}

			if(this.slideshow_showcase) {
				this.slideshow_showcase.resized();

				// Resize ul
				u.ass(this.ul_showcase, {
					"height":(this.ul_showcase.offsetWidth / 1.7768) + "px"
				});
			}

			// Resize top cover image
			u.ass(this.top_div, {
				"height":window.innerHeight+"px",
			});

			u.ass(this.cover, {
				"width":u.browserW()+"px",
				"margin-left":-((u.browserW()-this.top_div.offsetWidth) / 2)+"px"
			});

			// Resize dobbl boxes
			for(var i = 0; i < this.dobbl.length; i++) {
				u.ass(this.dobbl[i], {
					"height":(this.dobbl[i].offsetWidth / 1.8587) + "px"
				});
			}

			
			// Set money part width
			u.ass(this.money, {
				"width":u.browserW()+"px",
				"margin-left":-((u.browserW()-this.offsetWidth) / 2)+"px"
			});

			// Set bottom width
			u.ass(this.bottom, {
				"width":u.browserW()+"px",
				"margin-left":-((u.browserW()-this.offsetWidth) / 2)+"px"
			});

			// Apply footer height to scene as bottom margin, to create footer reveal effect
			u.ass(this, {
				"margin-bottom":(footer.offsetHeight - 1) + "px"
			});

			// Update drag coordinates
			u.e.setDragBoundaries(this.slideshow_showcase.wrapper, this.slideshow_showcase.index);

		}

		scene.scrolled = function() {
			// u.bug("scene.scrolled:", this);

			// Animate containers elements
			for(var i = 0; i < this.containers.length; i++) {

				var container = this.containers[i];

				// Only do check if container hasn't been shown
				if(!container.is_visible) {
					
					// Show container when in view
					if (this.visible(container)) {
						container.is_visible = true;
						u.ac(container, "visible");
					}

				}

			}

		}

		scene.ready = function() {
			// u.bug("scene.ready:", this);

			// enable callbacks from resized and scrolled
			page.cN.scene = this;

			// Function that detects wether or not element is in view;
			this.visible = function(e) {
				// Get elements coordinates from window view
				var bounding = e.getBoundingClientRect();

				// Assigning element top and bottom for comparison
				var top = bounding.top;
				var bottom = bounding.bottom;

				// Get height of navigation bar for compensation
				var navHeight = page.nN.offsetHeight;

				// Get supported version of window height depending on browser
				var windowHeight = (window.innerHeight || document.documentElement.clientHeight);

				// If either top or bottom is bigger than 0 offset by navigations height and top is under window height,
				// then return true. Else return false.
				return (
					(top  > 0 + navHeight || bottom > 0 + navHeight)
					&&
					top < windowHeight
				);
			}

			// Image injector
			this.injectImage = function(e, src, alt) {
				u.ae(e, "img", {"src": src, "alt":alt});
			}

			// Get top div and cover
			this.top_div = u.qs("#landing", this);
			this.cover = u.qs("#landing .cover", this.top_div);

			// Preload cover image
			u.preloader(this.top_div, [
				"/img/desktop/top.jpg"
			]);

			// When cover image is loaded
			this.top_div.loaded = function(queue) {

				// Set top_div height
				u.ass(this, {
					"height":window.innerHeight+"px"
				});

				// Get cover and set width
				u.ass(scene.cover, {
					"width":u.browserW()+"px",
					"margin-left":-((u.browserW()-this.offsetWidth) / 2)+"px"
				});

				// Scale topdiv texts
				u.textscaler(this, {
					"min_width":600,
					"max_width":1440,
					"unit":"px",

					"h1":{
						"min_size":28,
						"max_size":40
					},

					"h2":{
						"unit":"px",
						"min_size":18,
						"max_size":28
					},
				});

				// Show page
				u.a.transition(page, "opacity 1s ease");
				u.ass(page, {
					"opacity":1
				});

			}

			// Get dobbl boxes
			this.dobbl = u.qsa(".dobbl", this);

			// Get money section
			this.money = u.qs("#money");

			// Get bottom section
			this.bottom = u.qs("#bottom");

			// Apply footer height to scene as bottom margin, to create footer reveal effect
			u.ass(this, {
				"margin-bottom":(footer.offsetHeight - 1) + "px"
			});

			// Get elements to "push"
			this.containers = u.qsa(".container", this);

			// Landig arrow scroll
			this.landing_arrow = u.qs(".landing-arrow", this);
			u.ce(this.landing_arrow);
			this.landing_arrow.clicked = function() {

				// Get only #{target}
				var anchor = this.url.replace(/[^#]+/,"");

				// Get target element
				var target = u.qs(anchor);

				// Scroll to element
				u.scrollTo(window, {"node":target, "offset_y":120});
			}

			// Get showcase image list
			this.ul_showcase = u.qs("ul.slideshow.showcase", this);
			if(this.ul_showcase) {
				
				// Create new slideshow (with index)
				this.slideshow_showcase = u.slideshow(this.ul_showcase, {index:true});

				// Slides are preloaded
				this.slideshow_showcase.preloaded = function() {
					// select current node (first slide if none specified)
					if(!this.selected_node) {
						this.selectNode(0);
					}

				}

				// Create wrapper for thumbnails
				this.slideshow_showcase.wrapper = u.wc(this.slideshow_showcase.index, "ul", {class:"wrapper"});

				// Object of texts
				this.slideshow_showcase.slide_txt = {
					0:"Full retreat – black is still the new black",
					1:"Full retreat by night – moonlit and blacker still",
					2:"Full retreat dressed in white",
					3:"Villa and two suites with black mystery pools",
					4:"Villa and two suites – arrival and departure",
					5:"Villa on the beach – sunbeds in the shade",
					6:"Villa dressed in white & azul",
					7:"Villa dressed in white & sunset",
					8:"Villa living by day – beach or couch?",
					9:"Villa living by night – couch or bay?",
					10:"Villa bedroom – morning breeze included",
					11:"Villa bedroom – morning dip included",
					12:"Bathroom Villa and Suite – fluffy towels included",
					13:"Suite complete and sweet with bar/kitchenette and pop up TV",
					14:"Upcoming locations – Med & Mex"
				}

				// Create textbox
				this.slideshow_showcase.textbox = u.ae(this.slideshow_showcase, "div", {class:"text"});

				// Insert paragraph into textbox
				this.slideshow_showcase.textbox.txt = u.ie(this.slideshow_showcase.textbox, "p");

				// Create and insert download button
				this.slideshow_showcase.download = u.ie(this.slideshow_showcase.textbox, "div", {class:"download"});

				// Clicking download button
				u.ce(this.slideshow_showcase.download)
				this.slideshow_showcase.download.clicked= function() {
					console.log(scene.slideshow_showcase.selected_node._i);
					var image = scene.slideshow_showcase.selected_node._i + 1;
					window.open("/download/sanctumananda_" + image + ".jpg");
				}

				// Create plus button
				this.slideshow_showcase.txtbtn = u.ie(this.ul_showcase, "div", {class:"txtbtn"});

				// Clicking plus button
				u.ce(this.slideshow_showcase.txtbtn);
				this.slideshow_showcase.txtbtn.clicked = function() {
					if(!this.is_active) {
						this.is_active = true;

						// Rotate button
						u.ac(this, "active");

						// Show textbox
						u.ass(scene.slideshow_showcase.textbox, {
							"display":"block"
						});

						// Hide index
						u.ass(scene.slideshow_showcase.index, {
							"display":"none"
						});

					}
					else {
						this.is_active = false;

						// Rotate button
						u.rc(this, "active");

						// Hide textbox
						u.ass(scene.slideshow_showcase.textbox, {
							"display":"none"
						});

						// Show index
						u.ass(scene.slideshow_showcase.index, {
							"display":"block"
						});
					}

				}

				// Create small arrow left
				this.slideshow_showcase.arrow_left = u.ie(this.slideshow_showcase.index, "div", {class:"left"});
				u.as(this.slideshow_showcase.arrow_left, "display", "none"); // Initially hide arrow

				// Clicking arrow left
				u.ce(this.slideshow_showcase.arrow_left);
				this.slideshow_showcase.arrow_left.clicked = function() {

					// Create variables
					var x;
					var wrapper = scene.slideshow_showcase.wrapper;
					// If wrapper havent been moved yet
					if (!wrapper.current_x) {
						wrapper.current_x = 0;
						x = wrapper.current_x;
					}
					else {
						x = wrapper.current_x += 500;
					}

					// Keep movement within bounds
					if(x > 0) {
						wrapper.current_x = 0;
						x = wrapper.current_x;
					}

					// Move wrapper
					u.a.transition(wrapper, "all 1s cubic-bezier(0, 0, 0.25, 1)");
					u.a.translate(wrapper, x, 0);

					// Emulate that wrapper is moved
					wrapper.moved();
				}

				// Create small arrow right
				this.slideshow_showcase.arrow_right = u.ie(this.slideshow_showcase.index, "div", {class:"right"});

				// Clicking arrow right
				u.ce(this.slideshow_showcase.arrow_right);
				this.slideshow_showcase.arrow_right.clicked = function() {

					// Create variables
					var x;
					var wrapper = scene.slideshow_showcase.wrapper;
					// If wrapper havent been moved yet
					if (!wrapper.current_x) {
						wrapper.current_x = -500;
						x = wrapper.current_x;
					}
					else {
						x = wrapper.current_x -= 500;
					}

					// Keep movement within bounds
					if(x < wrapper.start_drag_x) {
						wrapper.current_x = wrapper.start_drag_x;
						x = wrapper.current_x;
					}

					// Move wrapper
					u.a.transition(wrapper, "all 1s cubic-bezier(0, 0, 0.25, 1)");
					u.a.translate(wrapper, x, 0);

					// Emulate that wrapper is moved
					wrapper.moved();
				}

				// Whenever wrapper is moved
				this.slideshow_showcase.wrapper.moved = function() {

					// Check if first thumbnail is visible
					if(this.current_x > - 180) {
						u.ass(scene.slideshow_showcase.arrow_left, {
							"display":"none"
						});
					}

					// Check if last thumbnail is visible
					else if (this.current_x < this.start_drag_x + 180) {
						u.ass(scene.slideshow_showcase.arrow_right, {
							"display":"none"
						});
					}

					else {
						u.ass(scene.slideshow_showcase.arrow_left, {
							"display":"block"
						});

						u.ass(scene.slideshow_showcase.arrow_right, {
							"display":"block"
						});
					}

				}

				// When a slide is picked/shown
				this.slideshow_showcase.nodeSelected = function(node) {
					// u.bug("nodeSelected:", node);

					// Set txtbox text, _i is a reference to the key of current node
					this.textbox.txt.innerHTML = this.slide_txt[node._i];
				}

				this.slideshow_showcase.nodeEntered = function(node) {
					// u.bug("nodeEntered:", node);
				}
				this.slideshow_showcase.nodeCleared = function(node) {
					// u.bug("nodeCleared:", node);
				}
				// Start slideshow setup
				this.slideshow_showcase.prepare();
			}

			// Get plan image list
			this.ul_plans = u.qs("ul.slideshow.plans", this);
			if(this.ul_plans) {
				
				// Create new slideshow (with index)
				this.slideshow_plans = u.slideshow(this.ul_plans, {index:true});

				// Set width of slideshow
				u.ass(this.slideshow_plans, {
					width:"100%"
				});

				// Slides are preloaded
				this.slideshow_plans.preloaded = function() {
					// select current node (first slide if none specified)
					if(!this.selected_node) {
						this.selectNode(0);
					}

				}

				this.slideshow_plans.nodeSelected = function(node) {
					// u.bug("nodeSelected:", node);
				}
				this.slideshow_plans.nodeEntered = function(node) {
					// u.bug("nodeEntered:", node);
				}
				this.slideshow_plans.nodeCleared = function(node) {
					// u.bug("nodeCleared:", node);
				}
				// Start slideshow setup
				this.slideshow_plans.prepare();

			}

			// Inject images
			this.initImages();

			// Wrap money content and keep alignment
			this.money.wrapper = u.wc(this.money, "div", {class:"wrapper"});
			u.ass(this.money.wrapper, {
				"max-width":"1440px",
				"min-width":"600px",
				"margin":"0 auto"
			});

			// Drag on showcase index
			u.e.drag(this.slideshow_showcase.wrapper, this.slideshow_showcase.index, {"horizontal_lock":true, "overflow":"scroll"});

			// Make sure everything is the right size
			this.resized();
		}

		scene.initImages = function() {

			// # Backgrounds

			// Nav
			this.logo = u.qs("#navigation .logo");
			u.ass(this.logo, {
				"background": "url(/img/logo.svg) no-repeat center center",
				"background-size": "contain"
			});

			this.zoom = u.qs(".zoom", this.cover);
			u.ass(this.zoom, {
				"background": "url(/img/desktop/top.jpg) no-repeat center center",
				"background-size": "cover"
			});

			// Dobbbl boxes
			this.locations = u.qs(".locations", this);

			this.locations_text = u.qs(".text", this.locations);
			u.ass(this.locations_text, {
				"background": "url(/img/darkpattern.png)",
			});
			this.locations_retreat = u.qs(".image", this.locations);
			u.ass(this.locations_retreat, {
				"background": "url(/img/desktop/retreat.jpg) no-repeat center center",
				"background-size": "cover"
			});

			this.beach = u.qs(".beach", this);

			this.beach_text = u.qs(".text", this.beach);
			u.ass(this.beach_text, {
				"background": "url(/img/desktop/darkwood.jpg) no-repeat center center",
				"background-size": "cover"
			});
			this.beach_girl = u.qs(".image", this.beach);
			u.ass(this.beach_girl, {
				"background": "url(/img/desktop/beachgirl.jpg) no-repeat center center",
				"background-size": "cover"
			});

			this.map = u.qs(".map", this);
			u.ass(this.map, {
				"background": "url(/img/desktop/map.jpg) no-repeat center center",
				"background-size": "cover"
			});

			// Bg patterns
			u.ass(this.money, {
				"background": "url(/img/lightpattern.png)",
			});

			this.footer_container = u.qs("#footer .container");
			u.ass(this.footer_container, {
				"background": "url(/img/darkpattern.png)",
			});

			// Slideshows
			this.thumbnails = this.slideshow_showcase.wrapper.childNodes;

			for(var i = 0; i < this.thumbnails.length; i++) {
				u.ass(this.thumbnails[i], {
					"background":"url(/img/desktop/showcase/sanctumananda_" + (i + 1) + ".jpg",
					"background-size":"cover"
				})
			}

			u.ass(this.slideshow_showcase.arrow_left, {
				"background":"url(/img/slideshow/small-arrow-left.png) no-repeat center center",
				"background-size":"cover"
			});

			u.ass(this.slideshow_showcase.arrow_right, {
				"background":"url(/img/slideshow/small-arrow-right.png) no-repeat center center",
				"background-size":"cover"
			});

			u.ass(this.slideshow_showcase.download, {
				"background":"url(/img/slideshow/download.png) no-repeat center center",
				"background-size":"contain"
			});

			// # Injections

			// Landing arrow image
			this.landing_anchor = u.qs(".landing-arrow a", this.landing_arrow);
			this.injectImage(this.landing_anchor, "/img/arrow.png", "arrow");

			// Divider images
			this.dividers = u.qsa(".divider", this);
			for(var i = 0; i < this.dividers.length; i++) {
				this.injectImage(this.dividers[i], "/img/divider.png", "divider");
			}

			// Bottom last impression image
			this.injectImage(this.bottom, "/img/desktop/bottom.jpg", "last impression");
		}

		// scene is ready when page is ready for presentation (mainly when images are loaded);
		scene.ready();
		
	}
}
